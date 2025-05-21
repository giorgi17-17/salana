import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/Footer.module.css";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    alert("გმადლობთ ჩვენს საინფორმაციო ბიულეტენზე გამოწერისთვის!");
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerDivider}></div>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Company info */}
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.footerLogo}>
              <span className={styles.logoHighlight}>S</span>alana
            </Link>
            <p className={styles.footerDescription}>
              სილამაზისა და ჯანმრთელობის პროფესიონალების დაკავშირება კლიენტებთან
              ჩვენი ინოვაციური პლატფორმის საშუალებით. აღმოაჩინეთ, დაჯავშნეთ და
              ისარგებლეთ პრემიუმ მომსახურებით, რომელიც მორგებულია თქვენს
              საჭიროებებზე.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>სწრაფი ბმულები</h3>
            <div className={styles.footerLinks}>
              <Link to="/" className={styles.footerLink}>
                მთავარი
              </Link>
              <Link to="/services" className={styles.footerLink}>
                სერვისები
              </Link>
              <Link to="/professionals" className={styles.footerLink}>
                პროფესიონალები
              </Link>
              <Link to="/about" className={styles.footerLink}>
                ჩვენს შესახებ
              </Link>
              <Link to="/contact" className={styles.footerLink}>
                კონტაქტი
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>სერვისები</h3>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>
                თმის სტილი
              </a>
              <a href="#" className={styles.footerLink}>
                ფრჩხილების მოვლა
              </a>
              <a href="#" className={styles.footerLink}>
                კანის პროცედურები
              </a>
              <a href="#" className={styles.footerLink}>
                მასაჟი
              </a>
              <a href="#" className={styles.footerLink}>
                მაკიაჟი
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>სიახლეები</h3>
            <p className={styles.footerDescription}>
              გამოიწერეთ ჩვენი სიახლეები, რათა მიიღოთ განახლებები და სპეციალური
              შეთავაზებები.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  placeholder="თქვენი ელ-ფოსტა"
                  required
                />
                <button type="submit" className={styles.submitButton}>
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
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </form>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <span>contact@salana.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()}{" "}
            <span className={styles.highlight}>Salana</span>. ყველა უფლება
            დაცულია.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
