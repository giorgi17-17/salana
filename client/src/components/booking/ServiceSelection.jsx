import { useState } from "react";
import styles from "../../styles/components/booking/StepComponents.module.css";
import buttonStyles from "../../styles/components/Button.module.css";

// Default services if none are provided by the salon
const defaultServices = [
  {
    id: "haircut",
    name: "თმის შეჭრა",
    description: "პროფესიონალური თმის შეჭრა სხვადასხვა სტილში",
    price: 50,
    duration: 45, // in minutes
    image: "haircut.jpg",
  },
  {
    id: "color",
    name: "თმის შეღებვა",
    description: "თმის შეღებვა პრემიუმ ხარისხის საღებავებით",
    price: 120,
    duration: 120, // in minutes
    image: "coloring.jpg",
  },
  {
    id: "styling",
    name: "სტაილინგი",
    description: "თმის სტაილინგი სპეციალური ღონისძიებისთვის",
    price: 70,
    duration: 60, // in minutes
    image: "styling.jpg",
  },
  {
    id: "treatment",
    name: "თმის მკურნალობა",
    description: "მკვებავი და აღმდგენი პროცედურები დაზიანებული თმისთვის",
    price: 90,
    duration: 90, // in minutes
    image: "treatment.jpg",
  },
];

function ServiceSelection({
  selectedService,
  setSelectedService,
  nextStep,
  services,
}) {
  const [error, setError] = useState("");

  // Use salon-specific services if provided, otherwise use default services
  const availableServices = services || defaultServices;

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedService) {
      setError("გთხოვთ აირჩიოთ სერვისი გასაგრძელებლად");
      return;
    }
    nextStep();
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>აირჩიეთ სერვისი</h2>
      <p className={styles.stepDescription}>
        გთხოვთ აირჩიოთ სასურველი სერვისი ჩვენი მენიუდან
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.serviceGrid}>
        {availableServices.map((service) => (
          <div
            key={service.id}
            className={`${styles.serviceCard} ${
              selectedService?.id === service.id ? styles.selected : ""
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className={styles.serviceImagePlaceholder}>
              {/* Replace with actual image later */}
              <div className={styles.serviceIconPlaceholder}></div>
            </div>
            <div className={styles.serviceInfo}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <div className={styles.serviceDetails}>
                <span className={styles.servicePrice}>{service.price} ₾</span>
                <span className={styles.serviceDuration}>
                  {service.duration} წუთი
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.stepActions}>
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

export default ServiceSelection;
