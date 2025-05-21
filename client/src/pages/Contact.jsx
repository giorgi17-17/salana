import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission, like sending data to an API
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <div
        className="container"
        style={{ paddingTop: "120px", paddingBottom: "80px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "var(--spacing-sm)",
              color: "var(--text)",
            }}
          >
            Get in <span style={{ color: "var(--primary)" }}>Touch</span>
          </h1>
          <div
            style={{
              width: "80px",
              height: "3px",
              backgroundColor: "var(--primary)",
              margin: "var(--spacing-md) auto",
            }}
          ></div>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Have questions or feedback? We'd love to hear from you. Fill out the
            form below and we'll respond as soon as possible.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--spacing-xl)",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Contact Information */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(27, 59, 47, 0.5)",
                padding: "var(--spacing-lg)",
                borderRadius: "var(--border-radius-lg)",
                border: "1px solid rgba(191, 168, 101, 0.1)",
              }}
            >
              <h3
                style={{
                  color: "var(--primary)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Contact Information
              </h3>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <p
                  style={{
                    color: "var(--text)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Email:
                </p>
                <p style={{ color: "var(--text-muted)" }}>contact@salana.com</p>
              </div>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <p
                  style={{
                    color: "var(--text)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Phone:
                </p>
                <p style={{ color: "var(--text-muted)" }}>+1 (555) 123-4567</p>
              </div>
              <div>
                <p
                  style={{
                    color: "var(--text)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Address:
                </p>
                <p style={{ color: "var(--text-muted)" }}>
                  123 Beauty Street, Suite 100
                </p>
                <p style={{ color: "var(--text-muted)" }}>
                  Los Angeles, CA 90001
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(27, 59, 47, 0.5)",
                padding: "var(--spacing-lg)",
                borderRadius: "var(--border-radius-lg)",
                border: "1px solid rgba(191, 168, 101, 0.1)",
              }}
            >
              <h3
                style={{
                  color: "var(--primary)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Business Hours
              </h3>
              <div style={{ marginBottom: "var(--spacing-xs)" }}>
                <p
                  style={{
                    color: "var(--text)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Monday - Friday:
                </p>
                <p style={{ color: "var(--text-muted)" }}>9:00 AM - 8:00 PM</p>
              </div>
              <div style={{ marginBottom: "var(--spacing-xs)" }}>
                <p
                  style={{
                    color: "var(--text)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Saturday:
                </p>
                <p style={{ color: "var(--text-muted)" }}>10:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p
                  style={{
                    color: "var(--text)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Sunday:
                </p>
                <p style={{ color: "var(--text-muted)" }}>Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "rgba(27, 59, 47, 0.5)",
              padding: "var(--spacing-xl)",
              borderRadius: "var(--border-radius-lg)",
              border: "1px solid rgba(191, 168, 101, 0.1)",
            }}
          >
            <h2
              style={{
                color: "var(--text)",
                marginBottom: "var(--spacing-lg)",
                textAlign: "center",
              }}
            >
              Send us a message
            </h2>

            <div style={{ marginBottom: "var(--spacing-md)" }}>
              <label
                htmlFor="name"
                style={{
                  color: "var(--text)",
                  display: "block",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(27, 59, 47, 0.8)",
                  border: "1px solid rgba(191, 168, 101, 0.2)",
                  borderRadius: "var(--border-radius-md)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "var(--spacing-md)" }}>
              <label
                htmlFor="email"
                style={{
                  color: "var(--text)",
                  display: "block",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(27, 59, 47, 0.8)",
                  border: "1px solid rgba(191, 168, 101, 0.2)",
                  borderRadius: "var(--border-radius-md)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "var(--spacing-md)" }}>
              <label
                htmlFor="subject"
                style={{
                  color: "var(--text)",
                  display: "block",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(27, 59, 47, 0.8)",
                  border: "1px solid rgba(191, 168, 101, 0.2)",
                  borderRadius: "var(--border-radius-md)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <label
                htmlFor="message"
                style={{
                  color: "var(--text)",
                  display: "block",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "rgba(27, 59, 47, 0.8)",
                  border: "1px solid rgba(191, 168, 101, 0.2)",
                  borderRadius: "var(--border-radius-md)",
                  color: "var(--text)",
                  outline: "none",
                  resize: "vertical",
                }}
              ></textarea>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--background-darker)",
                padding: "0.75rem 2rem",
                borderRadius: "var(--border-radius-md)",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all var(--transition-medium)",
                display: "block",
                margin: "0 auto",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
