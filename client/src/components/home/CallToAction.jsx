import { Link } from "react-router-dom";
import styles from "../../styles/components/CallToAction.module.css";
import buttonStyles from "../../styles/components/Button.module.css";
import { useState, useEffect } from "react";

function CallToAction() {
  const [screenSize, setScreenSize] = useState("desktop");

  // Check screen size on component mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setScreenSize("mobile");
      } else if (width <= 768) {
        setScreenSize("tablet");
      } else if (width <= 1024) {
        setScreenSize("laptop");
      } else {
        setScreenSize("desktop");
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section className={styles.ctaSection}>
      {/* Diagonal divider */}
      <div className={styles.diagonalDivider}></div>

      <div className="container">
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>მზად ხართ ტრანსფორმაციისთვის?</h2>
          <p className={styles.ctaText}>
            დაჯავშნეთ თქვენი ვიზიტი დღესვე და ისარგებლეთ ჩვენი პროფესიონალი
            სპეციალისტების მომსახურებით.
          </p>
          <div className={styles.ctaButtonGroup}>
            <Link to="/booking">
              <button
                className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.large}`}
              >
                დაჯავშნე ახლავე
              </button>
            </Link>
            <Link to="/services">
              <button
                className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.large}`}
              >
                ნახეთ სერვისები
              </button>
            </Link>
          </div>

          {/* Accent dots decoration - hide on smallest screens */}
          {screenSize !== "mobile" && (
            <>
              <div
                className={`${styles.accentDots} ${styles.accentDotsTopRight}`}
              >
                {[...Array(screenSize === "tablet" ? 6 : 9)].map((_, i) => (
                  <div key={i} className={styles.dot}></div>
                ))}
              </div>
              <div
                className={`${styles.accentDots} ${styles.accentDotsBottomLeft}`}
              >
                {[...Array(screenSize === "tablet" ? 6 : 9)].map((_, i) => (
                  <div key={i} className={styles.dot}></div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
