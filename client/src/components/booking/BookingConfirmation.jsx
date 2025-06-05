import styles from "../../styles/components/BookingConfirmation.module.css";
import { Link } from "react-router-dom";
import buttonStyles from "../../styles/components/Button.module.css";

function BookingConfirmation({ bookingData }) {
  return (
    <div className={styles.confirmation}>
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h2 className={styles.title}>დაჯავშნა წარმატებულია!</h2>

      <p className={styles.message}>
        თქვენი ჯავშანი მიღებულია. ჩვენ მალე დაგიკავშირდებით დასადასტურებლად.
      </p>

      {bookingData && (
        <div className={styles.details}>
          <h3>ჯავშნის დეტალები</h3>

          <div className={styles.detailItem}>
            <span className={styles.label}>სახელი:</span>
            <span className={styles.value}>{bookingData.name}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>სერვისი:</span>
            <span className={styles.value}>{bookingData.service}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>თარიღი:</span>
            <span className={styles.value}>{bookingData.date}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>დრო:</span>
            <span className={styles.value}>{bookingData.time}</span>
          </div>

          {bookingData.stylist && (
            <div className={styles.detailItem}>
              <span className={styles.label}>სტილისტი:</span>
              <span className={styles.value}>{bookingData.stylist}</span>
            </div>
          )}

          <div className={styles.detailItem}>
            <span className={styles.label}>ფასი:</span>
            <span className={styles.value}>{bookingData.price} ₾</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>ჯავშნის ID:</span>
            <span className={styles.value}>{bookingData.bookingId}</span>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Link to="/">
          <button
            className={`${buttonStyles.button} ${buttonStyles.secondary}`}
          >
            დაბრუნება მთავარ გვერდზე
          </button>
        </Link>
        <Link to="/booking">
          <button className={`${buttonStyles.button} ${buttonStyles.primary}`}>
            ახალი ჯავშანი
          </button>
        </Link>
      </div>
    </div>
  );
}

export default BookingConfirmation;
