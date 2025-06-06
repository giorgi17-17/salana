import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/booking/StepComponents.module.css";
import buttonStyles from "../../styles/components/Button.module.css";

function DateTimeSelection({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  nextStep,
  prevStep,
  businessId,
  selectedService,
}) {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch business data on mount
  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);

  // Generate available dates (next 14 days)
  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        dayOfWeek: new Intl.DateTimeFormat("ka-GE", { weekday: "long" }).format(
          date
        ),
        dayOfMonth: date.getDate(),
        month: new Intl.DateTimeFormat("ka-GE", { month: "short" }).format(
          date
        ),
      });
    }

    setAvailableDates(dates);
  }, []);

  // Generate available time slots for the selected date
  useEffect(() => {
    if (selectedDate && businessHours.length > 0) {
      generateTimeSlots();
    }
  }, [selectedDate, businessHours, existingBookings, stylists]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      // Fetch business hours
      const { data: hoursData, error: hoursError } = await supabase
        .from("business_hours")
        .select("*")
        .eq("business_id", businessId);

      if (hoursError) throw hoursError;
      setBusinessHours(hoursData || []);

      // Fetch stylists
      const { data: stylistsData, error: stylistsError } = await supabase
        .from("business_stylists")
        .select("*")
        .eq("business_id", businessId)
        .eq("is_active", true);

      if (stylistsError) throw stylistsError;
      setStylists(stylistsData || []);
    } catch (error) {
      console.error("Error fetching business data:", error);
      setError("ბიზნეს ინფორმაციის ჩატვირთვისას მოხდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsForDate = async (date) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("business_id", businessId)
        .eq("booking_date", date)
        .in("status", ["pending", "confirmed", "in_progress"]);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  };

  const generateTimeSlots = async () => {
    if (!selectedDate) return;

    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay();

    // Find business hours for this day
    const dayHours = businessHours.find(
      (hour) => hour.day_of_week === dayOfWeek
    );

    if (!dayHours || dayHours.is_closed) {
      setAvailableTimeSlots([]);
      return;
    }

    // Fetch existing bookings for this date
    const bookings = await fetchBookingsForDate(selectedDate);
    setExistingBookings(bookings);

    // Parse business hours
    const [openHour, openMinute] = dayHours.open_time.split(":").map(Number);
    const [closeHour, closeMinute] = dayHours.close_time.split(":").map(Number);

    const timeSlots = [];
    let currentHour = openHour;
    let currentMinute = openMinute;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMinute < closeMinute)
    ) {
      const timeString = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Calculate total duration for multiple services
      const totalDuration = Array.isArray(selectedService)
        ? selectedService.reduce(
            (total, service) => total + service.duration,
            0
          )
        : selectedService?.duration || 60;

      // Check if service would end after business hours
      const serviceEndTime = new Date(`2000-01-01T${timeString}:00`);
      serviceEndTime.setMinutes(serviceEndTime.getMinutes() + totalDuration);
      const businessEndTime = new Date(
        `2000-01-01T${closeHour.toString().padStart(2, "0")}:${closeMinute
          .toString()
          .padStart(2, "0")}:00`
      );

      if (serviceEndTime > businessEndTime) {
        // Don't add this time slot if service would extend beyond business hours
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
        continue;
      }

      // Check availability for this time slot
      const availability = checkTimeSlotAvailability(timeString, bookings);

      timeSlots.push({
        time: timeString,
        available: availability.available,
        availableStylists: availability.availableStylists,
        bookedStylists: availability.bookedStylists,
      });

      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    setAvailableTimeSlots(timeSlots);
  };

  const checkTimeSlotAvailability = (timeString, bookings) => {
    // Calculate total duration for multiple services
    const totalDuration = Array.isArray(selectedService)
      ? selectedService.reduce((total, service) => total + service.duration, 0)
      : selectedService?.duration || 60; // Default 60 minutes

    const slotStart = new Date(`2000-01-01T${timeString}:00`);

    // Collect all booked stylist IDs across the entire service duration
    const allBookedStylistIds = new Set();

    // Check every 30-minute slot within the service duration for conflicts
    const slotsToCheck = Math.ceil(totalDuration / 30);
    for (let i = 0; i < slotsToCheck; i++) {
      const checkTime = new Date(slotStart.getTime() + i * 30 * 60000);
      const checkEnd = new Date(
        checkTime.getTime() + Math.min(30, totalDuration - i * 30) * 60000
      );

      const conflictingBookings = bookings.filter((booking) => {
        const bookingStart = new Date(`2000-01-01T${booking.booking_time}`);
        const bookingEnd = new Date(
          bookingStart.getTime() + booking.duration * 60000
        );

        return checkTime < bookingEnd && checkEnd > bookingStart;
      });

      // Add booked stylists from this slot to the set
      conflictingBookings.forEach((booking) => {
        if (booking.stylist_id) {
          allBookedStylistIds.add(booking.stylist_id);
        }
      });
    }

    // Find available stylists (those not booked during any part of the service)
    const availableStylists = stylists.filter(
      (stylist) => !allBookedStylistIds.has(stylist.id)
    );
    const bookedStylists = stylists.filter((stylist) =>
      allBookedStylistIds.has(stylist.id)
    );

    return {
      available: availableStylists.length > 0,
      availableStylists,
      bookedStylists,
    };
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
    setError("");
  };

  const handleTimeSelect = (timeSlot) => {
    if (!timeSlot.available) return;
    setSelectedTime(timeSlot.time);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedDate) {
      setError("გთხოვთ აირჩიოთ თარიღი");
      return;
    }

    if (!selectedTime) {
      setError("გთხოვთ აირჩიოთ დრო");
      return;
    }

    nextStep();
  };

  if (loading) {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.loading}>მონაცემები იტვირთება...</div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>აირჩიეთ თარიღი და დრო</h2>
      <p className={styles.stepDescription}>
        აირჩიეთ სასურველი თარიღი და დრო თქვენი ვიზიტისთვის
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.dateSelection}>
        <h3 className={styles.sectionTitle}>თარიღი</h3>
        <div className={styles.dateGrid}>
          {availableDates.map((date) => (
            <div
              key={date.date}
              className={`${styles.dateCard} ${
                selectedDate === date.date ? styles.selected : ""
              }`}
              onClick={() => handleDateSelect(date.date)}
            >
              <div className={styles.dateCardDay}>{date.dayOfWeek}</div>
              <div className={styles.dateCardDate}>{date.dayOfMonth}</div>
              <div className={styles.dateCardMonth}>{date.month}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className={styles.timeSelection}>
          <h3 className={styles.sectionTitle}>დრო</h3>
          {availableTimeSlots.length === 0 ? (
            <div className={styles.noTimeSlots}>ამ დღეს სალონი არ მუშაობს</div>
          ) : (
            <div className={styles.timeGrid}>
              {availableTimeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={`
                    ${styles.timeSlot} 
                    ${!slot.available ? styles.unavailable : ""} 
                    ${selectedTime === slot.time ? styles.selected : ""}
                  `}
                  onClick={() => handleTimeSelect(slot)}
                  title={
                    slot.available
                      ? `ხელმისაწვდომი სტილისტები: ${
                          slot.availableStylists
                            .map((s) => s.name)
                            .join(", ") || "ყველა"
                        }`
                      : `დაკავებული სტილისტები: ${slot.bookedStylists
                          .map((s) => s.name)
                          .join(", ")}`
                  }
                >
                  <div className={styles.timeSlotTime}>{slot.time}</div>
                  {slot.available && slot.availableStylists.length > 0 && (
                    <div className={styles.availableStylists}>
                      {slot.availableStylists.slice(0, 2).map((stylist) => (
                        <span
                          key={stylist.id}
                          className={styles.stylistIndicator}
                        >
                          {stylist.name.charAt(0)}
                        </span>
                      ))}
                      {slot.availableStylists.length > 2 && (
                        <span className={styles.moreStylists}>
                          +{slot.availableStylists.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
          გაგრძელება
        </button>
      </div>
    </div>
  );
}

export default DateTimeSelection;
