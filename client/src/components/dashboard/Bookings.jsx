import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/BusinessBookings.module.css";

function BusinessBookings({ businessId, onBookingsChange }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (businessId) {
      fetchBookings();
    }
  }, [businessId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          business_services(name, price, duration),
          business_stylists(name, specialty)
        `
        )
        .eq("business_id", businessId)
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true });

      if (error) {
        setError("ჯავშნების ჩატვირთვისას მოხდა შეცდომა");
        console.error("Error fetching bookings:", error);
        return;
      }

      setBookings(data || []);
      onBookingsChange && onBookingsChange();
    } catch (error) {
      setError("ჯავშნების ჩატვირთვისას მოხდა შეცდომა");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) {
        console.error("Error updating booking status:", error);
        setError("სტატუსის განახლებისას მოხდა შეცდომა");
        return;
      }

      // Refresh bookings after update
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      setError("სტატუსის განახლებისას მოხდა შეცდომა");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ka-GE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "მოლოდინში", className: styles.statusPending },
      confirmed: { label: "დადასტურებული", className: styles.statusConfirmed },
      in_progress: { label: "მიმდინარე", className: styles.statusInProgress },
      completed: { label: "დასრულებული", className: styles.statusCompleted },
      cancelled: { label: "გაუქმებული", className: styles.statusCancelled },
      no_show: { label: "არ გამოცხადდა", className: styles.statusNoShow },
    };

    const config = statusConfig[status] || { label: status, className: "" };
    return (
      <span className={`${styles.statusBadge} ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (selectedStatus === "all") return true;
    return booking.status === selectedStatus;
  });

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      bookingDate >= today && ["pending", "confirmed"].includes(booking.status)
    );
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>ჯავშნები იტვირთება...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ჯავშნების მართვა</h2>
        <button onClick={fetchBookings} className={styles.refreshButton}>
          განახლება
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>მთლიანი ჯავშნები</h3>
          <div className={styles.statValue}>{bookings.length}</div>
        </div>
        <div className={styles.statCard}>
          <h3>მომავალი ჯავშნები</h3>
          <div className={styles.statValue}>{upcomingBookings.length}</div>
        </div>
        <div className={styles.statCard}>
          <h3>დღევანდელი ჯავშნები</h3>
          <div className={styles.statValue}>
            {
              bookings.filter((b) => {
                const today = new Date().toISOString().split("T")[0];
                return b.booking_date === today;
              }).length
            }
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>მთლიანი შემოსავალი</h3>
          <div className={styles.statValue}>
            {bookings
              .filter((b) => b.status === "completed")
              .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0)
              .toFixed(2)}{" "}
            ₾
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {[
          { key: "all", label: "ყველა" },
          { key: "pending", label: "მოლოდინში" },
          { key: "confirmed", label: "დადასტურებული" },
          { key: "completed", label: "დასრულებული" },
          { key: "cancelled", label: "გაუქმებული" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`${styles.filterTab} ${
              selectedStatus === tab.key ? styles.filterTabActive : ""
            }`}
            onClick={() => setSelectedStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {selectedStatus === "all"
                ? "ჯერ არ გაქვთ ჯავშნები"
                : `არ არის ჯავშნები სტატუსით: ${selectedStatus}`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingInfo}>
                  <h3>{booking.customer_name}</h3>
                  <p>
                    {booking.customer_email} • {booking.customer_phone}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>სერვისი:</span>
                  <span>{booking.business_services?.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>თარიღი:</span>
                  <span>{formatDate(booking.booking_date)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>დრო:</span>
                  <span>{formatTime(booking.booking_time)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>ხანგრძლივობა:</span>
                  <span>{booking.duration} წუთი</span>
                </div>
                {booking.business_stylists && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>სტილისტი:</span>
                    <span>{booking.business_stylists.name}</span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.label}>ფასი:</span>
                  <span className={styles.price}>{booking.total_price} ₾</span>
                </div>
                {booking.customer_notes && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>შენიშვნა:</span>
                    <span>{booking.customer_notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={styles.bookingActions}>
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "confirmed")
                      }
                      className={`${styles.actionButton} ${styles.confirmButton}`}
                    >
                      დადასტურება
                    </button>
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "cancelled")
                      }
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                    >
                      გაუქმება
                    </button>
                  </>
                )}
                {booking.status === "confirmed" && (
                  <>
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "in_progress")
                      }
                      className={`${styles.actionButton} ${styles.progressButton}`}
                    >
                      დაწყება
                    </button>
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "cancelled")
                      }
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                    >
                      გაუქმება
                    </button>
                  </>
                )}
                {booking.status === "in_progress" && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, "completed")}
                    className={`${styles.actionButton} ${styles.completeButton}`}
                  >
                    დასრულება
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BusinessBookings;
