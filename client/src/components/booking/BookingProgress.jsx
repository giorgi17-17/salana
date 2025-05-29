import styles from "../../styles/components/booking/BookingProgress.module.css";

function BookingProgress({ currentStep, totalSteps }) {
  // Create an array of steps
  const steps = [
    { number: 1, label: "სერვისი" },
    { number: 2, label: "თარიღი და დრო" },
    { number: 3, label: "სტილისტი და დეტალები" },
    { number: 4, label: "დადასტურება" },
  ];

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      <div className={styles.stepsContainer}>
        {steps.map((step) => (
          <div
            key={step.number}
            className={`
              ${styles.step} 
              ${currentStep >= step.number ? styles.active : ""}
              ${currentStep > step.number ? styles.completed : ""}
            `}
          >
            <div className={styles.stepCircle}>
              {currentStep > step.number ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                step.number
              )}
            </div>
            <div className={styles.stepLabel}>{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingProgress;
