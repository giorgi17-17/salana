import styles from "../../styles/components/Hero.module.css";
import buttonStyles from "../../styles/components/Button.module.css";
import { useEffect, useState } from "react";

function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on component mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Background overlay with improved gradient */}
      <div className={styles.overlay}></div>

      {/* Background image with subtle animation */}
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      ></div>

      {/* Decorative accent */}
      <div className={styles.accentRight}></div>
      <div className={styles.accentLeft}></div>

      {/* Decorative elements - visible on larger screens */}
      <div className={`${styles.decorElement} ${styles.decorDot1}`}></div>
      <div className={`${styles.decorElement} ${styles.decorDot2}`}></div>
      <div className={`${styles.decorElement} ${styles.decorLine1}`}></div>
      <div className={`${styles.decorElement} ${styles.decorLine2}`}></div>

      <div className="container">
        <div className={styles.contentContainer}>
          <div className={styles.heroContent}>
            <div className={styles.preTitle}>სილამაზე და ჯანმრთელობა</div>
            <h1 className={styles.title}>
              აღმოაჩინე შენი იდეალური{" "}
              <span className={styles.titleHighlight}>სილამაზის</span>{" "}
              პროფესიონალი
            </h1>
            <p className={styles.subtitle}>
              დაუკავშირდით თქვენს რეგიონში მაღალი რეიტინგის მქონე სილამაზისა და
              ჯანმრთელობის პროფესიონალებს. მარტივად დაჯავშნეთ შეხვედრები და
              ისიამოვნეთ თქვენს საჭიროებებზე მორგებული პრემიუმ სერვისებით.
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={`${buttonStyles.button} ${buttonStyles.primary} ${
                  buttonStyles.glow
                } ${buttonStyles.large} ${
                  isMobile ? buttonStyles.fullWidth : ""
                }`}
              >
                სერვისების პოვნა
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
