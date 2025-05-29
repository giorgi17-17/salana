import { useState, useEffect } from "react";
import styles from "../../styles/components/booking/StepComponents.module.css";
import buttonStyles from "../../styles/components/Button.module.css";

function DateTimeSelection({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  nextStep,
  prevStep,
}) {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [error, setError] = useState("");

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
    if (!selectedDate) return;

    // Time slots from 10:00 to 19:00
    const timeSlots = [];
    const startHour = 10;
    const endHour = 19;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        timeSlots.push({
          time,
          available: Math.random() > 0.3, // Randomly make 30% of slots unavailable
        });
      }
    }

    setAvailableTimeSlots(timeSlots);
  }, [selectedDate]);

  const handleDateSelect = (date) => {
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
              >
                {slot.time}
              </div>
            ))}
          </div>
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
