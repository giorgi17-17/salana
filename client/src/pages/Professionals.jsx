import styles from "../styles/components/Card.module.css";

function Professionals() {
  // Placeholder professional data
  const professionals = [
    {
      name: "Sarah Johnson",
      specialty: "Hair Stylist",
      experience: "8+ years",
    },
    {
      name: "Michael Chen",
      specialty: "Massage Therapist",
      experience: "12+ years",
    },
    { name: "Emily Davis", specialty: "Nail Artist", experience: "5+ years" },
    {
      name: "David Wilson",
      specialty: "Skincare Specialist",
      experience: "10+ years",
    },
    {
      name: "Olivia Martinez",
      specialty: "Makeup Artist",
      experience: "7+ years",
    },
    {
      name: "James Taylor",
      specialty: "Wellness Coach",
      experience: "9+ years",
    },
  ];

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
            Our <span style={{ color: "var(--primary)" }}>Professionals</span>
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
            Meet our team of certified professionals dedicated to providing
            exceptional beauty and wellness services
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--spacing-lg)",
          }}
        >
          {professionals.map((professional, index) => (
            <div
              key={index}
              className={`${styles.card} ${styles.elevated} ${styles.interactive}`}
            >
              <div className={styles.padded}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    {professional.name.charAt(0)}
                  </div>
                  <h3 className={styles.cardTitle}>{professional.name}</h3>
                  <p className={styles.cardSubtitle}>
                    {professional.specialty}
                  </p>
                </div>
                <div className={styles.cardBody}>
                  <p>Experience: {professional.experience}</p>
                  <p>
                    Professional with extensive expertise in providing
                    high-quality services.
                  </p>
                </div>
                <div className={styles.cardFooter}>
                  <button
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--background-darker)",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--border-radius-md)",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Professionals;
