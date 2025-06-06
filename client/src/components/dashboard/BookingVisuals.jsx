import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/BookingVisuals.module.css";

function BookingVisuals({ businessId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (businessId) {
      fetchBookings();
    }
  }, [businessId, selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6);

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          business_services(name, duration),
          business_stylists(name)
        `
        )
        .eq("business_id", businessId)
        .gte("booking_date", startDate.toISOString().split("T")[0])
        .lte("booking_date", endDate.toISOString().split("T")[0])
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const week = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const getBookingsForDateAndTime = (date, time) => {
    const dateStr = date.toISOString().split("T")[0];
    return bookings.filter(
      (booking) =>
        booking.booking_date === dateStr &&
        booking.booking_time.slice(0, 5) === time
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "#22c55e",
      confirmed: "#3b82f6",
      cancelled: "#ef4444",
      in_progress: "#8b5cf6",
      no_show: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: "დასრულებული",
      confirmed: "დაგეგმილი",
      cancelled: "გაუქმებული",
      in_progress: "მიმდინარე",
      no_show: "არ გამოცხადდა",
    };
    return labels[status] || status;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
    })
      .format(date)
      .toUpperCase();
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const handleAppointmentClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleTimeSlotClick = (bookings) => {
    if (bookings.length === 1) {
      setSelectedBooking(bookings[0]);
    } else {
      setSelectedBooking(bookings);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const formatFullDate = (dateString) => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime12Hour = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div className={styles.loading}>ჯავშნები იტვირთება...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button onClick={() => navigateWeek(-1)} className={styles.navButton}>
            &#8249;
          </button>
          <h2 className={styles.title}>ჯავშნების კალენდარი</h2>
          <button onClick={() => navigateWeek(1)} className={styles.navButton}>
            &#8250;
          </button>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${
              viewMode === "list" ? styles.active : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            სია
          </button>
          <button
            className={`${styles.toggleButton} ${
              viewMode === "calendar" ? styles.active : ""
            }`}
            onClick={() => setViewMode("calendar")}
          >
            კალენდარი
          </button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className={styles.calendar}>
          <div className={styles.timeColumn}>
            <div className={styles.timeHeader}>GMT +7</div>
            {getTimeSlots().map((time) => (
              <div key={time} className={styles.timeSlot}>
                {time}
              </div>
            ))}
          </div>

          {getWeekDays().map((date, dayIndex) => (
            <div key={dayIndex} className={styles.dayColumn}>
              <div className={styles.dayHeader}>
                <div className={styles.dayName}>{formatDate(date)}</div>
                <div className={styles.dayDate}>{date.getDate()}</div>
              </div>

              {getTimeSlots().map((time) => {
                const dayBookings = getBookingsForDateAndTime(date, time);
                return (
                  <div key={time} className={styles.timeSlot}>
                    {dayBookings.length > 0 && (
                      <div
                        className={styles.appointmentBlock}
                        onClick={() => handleTimeSlotClick(dayBookings)}
                      >
                        <div className={styles.appointmentCount}>
                          {dayBookings.length}
                        </div>
                        <div className={styles.appointmentTime}>{time}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.listView}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={styles.listItem}
              onClick={() => handleAppointmentClick(booking)}
            >
              <div
                className={styles.statusIndicator}
                style={{ backgroundColor: getStatusColor(booking.status) }}
              />
              <div className={styles.bookingInfo}>
                <div className={styles.bookingHeader}>
                  <span className={styles.customerName}>
                    {booking.customer_name}
                  </span>
                  <span className={styles.bookingTime}>
                    {new Date(booking.booking_date).toLocaleDateString()} -{" "}
                    {booking.booking_time.slice(0, 5)}
                  </span>
                </div>
                <div className={styles.bookingDetails}>
                  <span>{booking.business_services?.name}</span>
                  <span className={styles.status}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      {showModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {Array.isArray(selectedBooking)
                  ? `${selectedBooking.length} ჯავშანი ${formatTime12Hour(
                      selectedBooking[0].booking_time
                    )}-ზე`
                  : "ჯავშნის დეტალები"}
              </h3>
              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              {Array.isArray(selectedBooking) ? (
                <div className={styles.multipleBookings}>
                  {selectedBooking.map((booking, index) => (
                    <div
                      key={booking.id}
                      className={styles.bookingCard}
                      onClick={() => handleAppointmentClick(booking)}
                    >
                      <div className={styles.bookingHeader}>
                        <h4>{booking.customer_name}</h4>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(booking.status),
                          }}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div className={styles.bookingDetails}>
                        <span>
                          <strong>სერვისი:</strong>{" "}
                          {booking.business_services?.name || "სერვისი"}
                        </span>
                        <span>
                          <strong>სტილისტი:</strong>{" "}
                          {booking.business_stylists?.name ||
                            "არ არის დანიშნული"}
                        </span>
                        <span>
                          <strong>ხანგრძლივობა:</strong>{" "}
                          {booking.business_services?.duration || "N/A"} წუთი
                        </span>
                        <span>
                          <strong>ფასი:</strong> ₾
                          {booking.total_price ||
                            booking.business_services?.price ||
                            "0"}
                        </span>
                      </div>
                      <div className={styles.clickHint}>
                        სრული დეტალებისთვის დააჭირეთ →
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.appointmentDetailsGrid}>
                  <div className={styles.detailSection}>
                    <h4>კლიენტის ინფორმაცია</h4>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>სახელი:</span>
                      <span className={styles.value}>
                        {selectedBooking.customer_name}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>ტელეფონი:</span>
                      <span className={styles.value}>
                        {selectedBooking.customer_phone || "არ არის მითითებული"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>ელ-ფოსტა:</span>
                      <span className={styles.value}>
                        {selectedBooking.customer_email || "არ არის მითითებული"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h4>ჯავშნის დეტალები</h4>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>თარიღი:</span>
                      <span className={styles.value}>
                        {formatFullDate(selectedBooking.booking_date)}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>დრო:</span>
                      <span className={styles.value}>
                        {formatTime12Hour(selectedBooking.booking_time)}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>ხანგრძლივობა:</span>
                      <span className={styles.value}>
                        {selectedBooking.business_services?.duration || "N/A"}{" "}
                        წუთი
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h4>სერვისი და პერსონალი</h4>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>სერვისი:</span>
                      <span className={styles.value}>
                        {selectedBooking.business_services?.name || "სერვისი"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>სტილისტი:</span>
                      <span className={styles.value}>
                        {selectedBooking.business_stylists?.name ||
                          "არ არის დანიშნული"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>ფასი:</span>
                      <span className={styles.value}>
                        ₾
                        {selectedBooking.total_price ||
                          selectedBooking.business_services?.price ||
                          "0"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h4>სტატუსი და შენიშვნები</h4>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>სტატუსი:</span>
                      <span
                        className={`${styles.value} ${styles.statusBadge}`}
                        style={{
                          backgroundColor: getStatusColor(
                            selectedBooking.status
                          ),
                        }}
                      >
                        {getStatusLabel(selectedBooking.status)}
                      </span>
                    </div>
                    {selectedBooking.notes && (
                      <div className={styles.detailItem}>
                        <span className={styles.label}>შენიშვნები:</span>
                        <span className={styles.value}>
                          {selectedBooking.notes}
                        </span>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.label}>ჯავშნის ID:</span>
                      <span className={styles.value}>
                        #{selectedBooking.id}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingVisuals;
