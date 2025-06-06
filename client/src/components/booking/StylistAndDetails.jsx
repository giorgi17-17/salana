import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/booking/StepComponents.module.css";
import buttonStyles from "../../styles/components/Button.module.css";

function StylistAndDetails({
  selectedStylist,
  setSelectedStylist,
  userDetails,
  setUserDetails,
  nextStep,
  prevStep,
  selectedService,
  selectedDate,
  selectedTime,
  businessId,
  stylists = [],
}) {
  const [error, setError] = useState("");
  const [stylistAvailability, setStylistAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && selectedTime && stylists.length > 0) {
      checkStylistAvailability();
    }
  }, [selectedDate, selectedTime, stylists]);

  const checkStylistAvailability = async () => {
    if (!selectedDate || !selectedTime || !businessId) return;

    try {
      setLoading(true);

      // Fetch existing bookings for the selected date and time
      const totalDuration = Array.isArray(selectedService)
        ? selectedService.reduce(
            (total, service) => total + service.duration,
            0
          )
        : selectedService?.duration || 60;
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("stylist_id, booking_time, duration")
        .eq("business_id", businessId)
        .eq("booking_date", selectedDate)
        .in("status", ["pending", "confirmed", "in_progress"]);

      if (error) throw error;

      // Check each stylist's availability
      const availability = {};
      stylists.forEach((stylist) => {
        availability[stylist.id] = checkStylistTimeConflict(
          stylist.id,
          selectedTime,
          totalDuration,
          bookings || []
        );
      });

      setStylistAvailability(availability);
    } catch (error) {
      console.error("Error checking stylist availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkStylistTimeConflict = (
    stylistId,
    timeString,
    duration,
    bookings
  ) => {
    const slotStart = new Date(`2000-01-01T${timeString}:00`);
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);

    // Find bookings for this stylist
    const stylistBookings = bookings.filter(
      (booking) => booking.stylist_id === stylistId
    );

    // Check for conflicts
    const hasConflict = stylistBookings.some((booking) => {
      const bookingStart = new Date(`2000-01-01T${booking.booking_time}`);
      const bookingEnd = new Date(
        bookingStart.getTime() + booking.duration * 60000
      );

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });

    return {
      available: !hasConflict,
      conflictingBooking: hasConflict
        ? stylistBookings.find((booking) => {
            const bookingStart = new Date(`2000-01-01T${booking.booking_time}`);
            const bookingEnd = new Date(
              bookingStart.getTime() + booking.duration * 60000
            );
            return slotStart < bookingEnd && slotEnd > bookingStart;
          })
        : null,
    };
  };

  const handleStylistSelect = (stylist) => {
    const availability = stylistAvailability[stylist.id];
    if (availability && !availability.available) {
      setError(`${stylist.name} დაკავებულია ამ დროს`);
      return;
    }
    setSelectedStylist(stylist);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    // Validate fields (stylist is optional)
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      setError("გთხოვთ შეავსოთ ყველა სავალდებულო ველი");
      return;
    }

    if (!validateEmail(userDetails.email)) {
      setError("გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი");
      return;
    }

    if (!validatePhone(userDetails.phone)) {
      setError("გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი");
      return;
    }

    // Check if selected stylist is still available
    if (selectedStylist) {
      const availability = stylistAvailability[selectedStylist.id];
      if (availability && !availability.available) {
        setError(
          `${selectedStylist.name} აღარ არის ხელმისაწვდომი ამ დროს. გთხოვთ აირჩიოთ სხვა სტილისტი.`
        );
        return;
      }
    }

    nextStep();
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{9}$/.test(phone.replace(/\s+/g, ""));
  };

  // Sort stylists: available first, then unavailable
  const sortedStylists = [...stylists].sort((a, b) => {
    const aAvailable = stylistAvailability[a.id]?.available !== false;
    const bAvailable = stylistAvailability[b.id]?.available !== false;

    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    return 0;
  });

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>
        აირჩიეთ სტილისტი და შეავსეთ ინფორმაცია
      </h2>
      <p className={styles.stepDescription}>
        აირჩიეთ სასურველი სტილისტი და შეავსეთ თქვენი საკონტაქტო ინფორმაცია
      </p>

      {selectedDate && selectedTime && (
        <div className={styles.selectedTimeInfo}>
          <h3>
            არჩეული დრო: {selectedTime} - {selectedDate}
          </h3>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.stylistSelection}>
        <h3 className={styles.sectionTitle}>
          აირჩიეთ სტილისტი (არასავალდებულო)
        </h3>
        {loading && (
          <div className={styles.loading}>
            მოწმდება სტილისტების ხელმისაწვდომობა...
          </div>
        )}
        {sortedStylists.length > 0 ? (
          <div className={styles.stylistGrid}>
            {sortedStylists.map((stylist) => {
              const availability = stylistAvailability[stylist.id];
              const isAvailable = availability?.available !== false;

              return (
                <div
                  key={stylist.id}
                  className={`${styles.stylistCard} ${
                    selectedStylist?.id === stylist.id ? styles.selected : ""
                  } ${!isAvailable ? styles.unavailable : ""}`}
                  onClick={() => handleStylistSelect(stylist)}
                >
                  <div className={styles.stylistAvailabilityBadge}>
                    {isAvailable ? (
                      <span className={styles.availableBadge}>
                        ხელმისაწვდომი
                      </span>
                    ) : (
                      <span className={styles.unavailableBadge}>
                        დაკავებული
                      </span>
                    )}
                  </div>

                  <div className={styles.stylistImage}>
                    <div className={styles.stylistImagePlaceholder}></div>
                  </div>

                  <div className={styles.stylistInfo}>
                    <h4 className={styles.stylistName}>{stylist.name}</h4>
                    <p className={styles.stylistSpecialty}>
                      {stylist.specialty}
                    </p>
                    <p className={styles.stylistExperience}>
                      გამოცდილება: {stylist.experience}
                    </p>
                    {stylist.bio && (
                      <p className={styles.stylistBio}>{stylist.bio}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.noStylists}>
            <p>
              ამ სალონში სტილისტები ჯერ არ არის დამატებული. შეგიძლიათ დაჯავშნოთ
              ყოველგვარი სტილისტის მითითების გარეშე.
            </p>
          </div>
        )}
      </div>

      <div className={styles.userDetails}>
        <h3 className={styles.sectionTitle}>თქვენი ინფორმაცია</h3>
        <div className={styles.formGroup}>
          <label htmlFor="name">სახელი და გვარი *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userDetails.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">ელ. ფოსტა *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userDetails.email || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">ტელეფონი *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userDetails.phone || ""}
            onChange={handleInputChange}
            placeholder="5XX XXX XXX"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">დამატებითი ინფორმაცია</label>
          <textarea
            id="notes"
            name="notes"
            value={userDetails.notes || ""}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button
          className={`${buttonStyles.button} ${buttonStyles.secondary}`}
          onClick={prevStep}
        >
          უკან
        </button>
        <button
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
          onClick={handleContinue}
        >
          დაჯავშნა
        </button>
      </div>
    </div>
  );
}

export default StylistAndDetails;
