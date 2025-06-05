import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import styles from "./BusinessRegister.module.css";

function BusinessRegister() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("პაროლები არ ემთხვევა!");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("გთხოვთ დაეთანხმოთ მომსახურების პირობებს!");
      setLoading(false);
      return;
    }

    const { data: authData, error: authError } = await signUp(
      formData.email,
      formData.password,
      {
        businessName: formData.businessName,
        phone: formData.phone,
      }
    );

    if (authError) {
      setError(
        authError.message === "User already registered"
          ? "ეს ელ-ფოსტა უკვე გამოყენებულია"
          : "რეგისტრაციის შეცდომა"
      );
    } else if (authData?.user) {
      // Create business record in the database
      const { error: businessError } = await supabase
        .from("businesses")
        .insert({
          user_id: authData.user.id,
          name: formData.businessName,
          phone: formData.phone,
          email: formData.email,
          status: "pending",
        });

      if (businessError) {
        console.error("Error creating business:", businessError);
        setError("ბიზნესის შექმნაში შეცდომა");
      } else {
        setSuccess("რეგისტრაცია წარმატებული! გადამისამართება დაშბორდზე...");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    }

    setLoading(false);
  };

  const isPasswordValid = formData.password.length >= 8;
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>შექმენით თქვენი ბიზნეს ანგარიში</h2>

          {error && (
            <div
              style={{
                color: "#ef4444",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                color: "#22c55e",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {success}
            </div>
          )}

          {/* Business Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="businessName" className={styles.label}>
              ბიზნესის სახელი
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              placeholder="შეიყვანეთ სალონის/ბიზნესის სახელი"
              className={styles.input}
            />
          </div>

          {/* Email and Phone in Two Columns */}
          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                ბიზნეს ელ-ფოსტა
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ბიზნესი@მაგალითი.com"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                ტელეფონის ნომერი
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+995 555 123 456"
                className={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              პაროლი
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="შექმენით ძლიერი პაროლი"
                className={`${styles.passwordInput} ${
                  formData.password === ""
                    ? styles.passwordInputDefault
                    : isPasswordValid
                    ? styles.passwordInputValid
                    : styles.passwordInputInvalid
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleButton}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {formData.password !== "" && (
              <p
                className={`${styles.validationMessage} ${
                  isPasswordValid
                    ? styles.validationMessageSuccess
                    : styles.validationMessageError
                }`}
              >
                {isPasswordValid
                  ? "✓ პაროლის სიძლიერე: კარგი"
                  : "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს"}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              პაროლის დადასტურება
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="გაიმეორეთ თქვენი პაროლი"
                className={`${styles.passwordInput} ${
                  formData.confirmPassword === ""
                    ? styles.passwordInputDefault
                    : passwordsMatch
                    ? styles.passwordInputValid
                    : styles.passwordInputInvalid
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.toggleButton}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {showConfirmPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {formData.confirmPassword !== "" && (
              <p
                className={`${styles.validationMessage} ${
                  passwordsMatch
                    ? styles.validationMessageSuccess
                    : styles.validationMessageError
                }`}
              >
                {passwordsMatch
                  ? "✓ პაროლები ემთხვევა"
                  : "პაროლები არ ემთხვევა"}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="terms" className={styles.checkboxLabel}>
              ვეთანხმები{" "}
              <Link to="/terms" className={styles.termsLink}>
                მომსახურების პირობებს
              </Link>{" "}
              და{" "}
              <Link to="/privacy" className={styles.termsLink}>
                კონფიდენციალურობის პოლიტიკას
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={
              !acceptTerms || !isPasswordValid || !passwordsMatch || loading
            }
            className={`${styles.submitButton} ${
              !acceptTerms || !isPasswordValid || !passwordsMatch || loading
                ? styles.submitButtonDisabled
                : styles.submitButtonEnabled
            }`}
          >
            {loading ? "რეგისტრაცია..." : "შექმენით ბიზნეს ანგარიში"}
          </button>

          <div className={styles.loginSection}>
            <p className={styles.loginText}>უკვე გაქვთ ანგარიში?</p>
            <Link to="/business/login" className={styles.loginLink}>
              შედით აქ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessRegister;
