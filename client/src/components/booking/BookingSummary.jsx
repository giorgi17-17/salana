import styles from "../../styles/components/booking/StepComponents.module.css";
import buttonStyles from "../../styles/components/Button.module.css";

function BookingSummary({
  selectedService,
  selectedDate,
  selectedTime,
  selectedStylist,
  userDetails,
  handleSubmit,
  prevStep,
  isSubmitting,
  submitError,
}) {
  // Function to format date into a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ka-GE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>ჯავშნის დეტალები</h2>
      <p className={styles.stepDescription}>
        გთხოვთ, გადაამოწმოთ თქვენი ჯავშნის დეტალები
      </p>

      {submitError && <div className={styles.error}>{submitError}</div>}

      <div className={styles.summaryContainer}>
        <div className={styles.summarySection}>
          <h3 className={styles.summarySectionTitle}>მომსახურება</h3>
          <div className={styles.summaryCard}>
            {Array.isArray(selectedService) && selectedService.length > 0 ? (
              <>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>სერვისები:</span>
                  <div className={styles.servicesList}>
                    {selectedService.map((service, index) => (
                      <div key={service.id} className={styles.serviceItem}>
                        <span className={styles.serviceName}>
                          {service.name}
                        </span>
                        <span className={styles.servicePrice}>
                          {service.price} ₾
                        </span>
                        <span className={styles.serviceDuration}>
                          ({service.duration} წუთი)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>სულ ფასი:</span>
                  <span className={styles.summaryValue}>
                    {selectedService.reduce(
                      (total, service) => total + service.price,
                      0
                    )}{" "}
                    ₾
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>სულ ხანგრძლივობა:</span>
                  <span className={styles.summaryValue}>
                    {selectedService.reduce(
                      (total, service) => total + service.duration,
                      0
                    )}{" "}
                    წუთი
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>სერვისი:</span>
                  <span className={styles.summaryValue}>
                    {selectedService?.name}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ფასი:</span>
                  <span className={styles.summaryValue}>
                    {selectedService?.price} ₾
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>ხანგრძლივობა:</span>
                  <span className={styles.summaryValue}>
                    {selectedService?.duration} წუთი
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.summarySection}>
          <h3 className={styles.summarySectionTitle}>დრო და სტილისტი</h3>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>თარიღი:</span>
              <span className={styles.summaryValue}>
                {formatDate(selectedDate)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>დრო:</span>
              <span className={styles.summaryValue}>{selectedTime}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>სტილისტი:</span>
              <span className={styles.summaryValue}>
                {selectedStylist?.name}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.summarySection}>
          <h3 className={styles.summarySectionTitle}>კლიენტის ინფორმაცია</h3>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>სახელი:</span>
              <span className={styles.summaryValue}>{userDetails.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>ელ. ფოსტა:</span>
              <span className={styles.summaryValue}>{userDetails.email}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>ტელეფონი:</span>
              <span className={styles.summaryValue}>{userDetails.phone}</span>
            </div>
            {userDetails.notes && (
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>შენიშვნა:</span>
                <span className={styles.summaryValue}>{userDetails.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.policyNote}>
          ჯავშნის დადასტურებით თქვენ ეთანხმებით ჩვენს{" "}
          <a href="#" className={styles.policyLink}>
            წესებსა და პირობებს
          </a>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button
          className={`${buttonStyles.button} ${buttonStyles.secondary}`}
          onClick={prevStep}
          disabled={isSubmitting}
        >
          უკან
        </button>
        <button
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "მიმდინარეობს დაჯავშნა..." : "დაჯავშნის დადასტურება"}
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;
