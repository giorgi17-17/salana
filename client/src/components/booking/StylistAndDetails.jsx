import { useState } from "react";
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
  stylists = [],
}) {
  const [error, setError] = useState("");

  const handleStylistSelect = (stylist) => {
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

    nextStep();
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{9}$/.test(phone.replace(/\s+/g, ""));
  };

  // Use stylists from the business or show message if none available
  const availableStylists = stylists || [];

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>
        აირჩიეთ სტილისტი და შეავსეთ ინფორმაცია
      </h2>
      <p className={styles.stepDescription}>
        აირჩიეთ სასურველი სტილისტი და შეავსეთ თქვენი საკონტაქტო ინფორმაცია
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.stylistSelection}>
        <h3 className={styles.sectionTitle}>
          აირჩიეთ სტილისტი (არასავალდებულო)
        </h3>
        {availableStylists.length > 0 ? (
          <div className={styles.stylistGrid}>
            {availableStylists.map((stylist) => (
              <div
                key={stylist.id}
                className={`${styles.stylistCard} ${
                  selectedStylist?.id === stylist.id ? styles.selected : ""
                }`}
                onClick={() => handleStylistSelect(stylist)}
              >
                <div className={styles.stylistImage}>
                  {/* Replace with actual image later */}
                  <div className={styles.stylistImagePlaceholder}></div>
                </div>
                <div className={styles.stylistInfo}>
                  <h4 className={styles.stylistName}>{stylist.name}</h4>
                  <p className={styles.stylistSpecialty}>{stylist.specialty}</p>
                  <p className={styles.stylistExperience}>
                    გამოცდილება: {stylist.experience}
                  </p>
                  {stylist.bio && (
                    <p className={styles.stylistBio}>{stylist.bio}</p>
                  )}
                </div>
              </div>
            ))}
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
