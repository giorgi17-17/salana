import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./BusinessLogin.module.css";

function BusinessLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
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

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setError("არასწორი ელ-ფოსტა ან პაროლი");
    } else {
      navigate("/dashboard"); // Redirect to dashboard
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>შედით თქვენს ანგარიშში</h2>

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
              placeholder="შეიყვანეთ ბიზნეს ელ-ფოსტა"
              className={styles.input}
            />
          </div>

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
                placeholder="შეიყვანეთ პაროლი"
                className={styles.passwordInput}
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
          </div>

          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="remember"
                className={styles.checkbox}
              />
              <label htmlFor="remember" className={styles.checkboxLabel}>
                დამახსოვრება
              </label>
            </div>
            <Link to="/forgot-password" className={styles.forgotLink}>
              პაროლის აღდგენა
            </Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "შემოწმება..." : "შესვლა"}
          </button>

          <div className={styles.registerSection}>
            <p className={styles.registerText}>არ გაქვთ ბიზნეს ანგარიში?</p>
            <Link to="/business/register" className={styles.registerLink}>
              შექმენით ანგარიში
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessLogin;
