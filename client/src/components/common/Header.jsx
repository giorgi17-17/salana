import { useState, useEffect } from "react";
import styles from "../../styles/components/Navigation.module.css";
import buttonStyles from "../../styles/components/Button.module.css";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if the path matches the current location
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className="container">
        <div className={styles.headerContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoHighlight}>S</span>alana
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.navMenu}>
            {/* <Link
              to="/"
              className={`${styles.navLink} ${
                isActive("/") ? styles.active : ""
              }`}
            >
              მთავარი
            </Link> */}
            <Link
              to="/services"
              className={`${styles.navLink} ${
                isActive("/services") ? styles.active : ""
              }`}
            >
              სერვისები
            </Link>
            {/* <Link
              to="/professionals"
              className={`${styles.navLink} ${
                isActive("/professionals") ? styles.active : ""
              }`}
            >
              სპეციალისტები
            </Link> */}
            <Link
              to="/about"
              className={`${styles.navLink} ${
                isActive("/about") ? styles.active : ""
              }`}
            >
              შესახებ
            </Link>
            <Link
              to="/contact"
              className={`${styles.navLink} ${
                isActive("/contact") ? styles.active : ""
              }`}
            >
              კონტაქტი
            </Link>
            <Link
              to="/pricing"
              className={`${styles.navLink} ${
                isActive("/pricing") ? styles.active : ""
              }`}
            >
              ბიზნესებისთვის
            </Link>
            {/* <Link
              to="/booking"
              className={`${styles.navLink} ${
                isActive("/booking") ? styles.active : ""
              }`}
            >
              დაჯავშნა
            </Link> */}
          </nav>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Link to="/business/login">
              <button
                className={`${buttonStyles.button} ${buttonStyles.secondary}`}
                style={{
                  marginRight: "var(--spacing-sm)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--primary)",
                  color: "var(--primary)",
                }}
              >
                ბიზნეს შესვლა
              </button>
            </Link>
            <Link to="/booking">
              <button
                className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.glow}`}
              >
                დაჯავშნე ახლავე
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="მობილური მენიუს გადართვა"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.menuIcon}
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <button
          className={styles.closeButton}
          onClick={closeMobileMenu}
          aria-label="მობილური მენიუს დახურვა"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.mobileMenuHeader}>
          <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
            <span className={styles.logoHighlight}>S</span>alana
          </Link>
        </div>

        <nav className={styles.mobileNavMenu}>
          <Link
            to="/"
            className={`${styles.mobileNavLink} ${
              isActive("/") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            მთავარი
          </Link>
          <Link
            to="/services"
            className={`${styles.mobileNavLink} ${
              isActive("/services") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            სერვისები
          </Link>
          <Link
            to="/professionals"
            className={`${styles.mobileNavLink} ${
              isActive("/professionals") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            სპეციალისტები
          </Link>
          <Link
            to="/about"
            className={`${styles.mobileNavLink} ${
              isActive("/about") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            შესახებ
          </Link>
          <Link
            to="/contact"
            className={`${styles.mobileNavLink} ${
              isActive("/contact") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            კონტაქტი
          </Link>
          <Link
            to="/pricing"
            className={`${styles.mobileNavLink} ${
              isActive("/pricing") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            ფასები
          </Link>
          <Link
            to="/booking"
            className={`${styles.mobileNavLink} ${
              isActive("/booking") ? styles.active : ""
            }`}
            onClick={closeMobileMenu}
          >
            დაჯავშნა
          </Link>
        </nav>

        <div className={styles.mobileActionButtons}>
          <Link
            to="/business/login"
            onClick={closeMobileMenu}
            style={{ width: "100%", marginBottom: "var(--spacing-sm)" }}
          >
            <button
              className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.fullWidth}`}
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--primary)",
                color: "var(--primary)",
              }}
            >
              ბიზნეს შესვლა
            </button>
          </Link>
          <Link
            to="/booking"
            onClick={closeMobileMenu}
            style={{ width: "100%" }}
          >
            <button
              className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.glow} ${buttonStyles.fullWidth}`}
            >
              დაჯავშნე ახლავე
            </button>
          </Link>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      <div
        className={`${styles.overlay} ${
          mobileMenuOpen ? styles.overlayVisible : ""
        }`}
        onClick={closeMobileMenu}
      ></div>
    </header>
  );
}

export default Header;
