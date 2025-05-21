import styles from "../styles/components/Features.module.css";

function About() {
  return (
    <>
      <div className="container" style={{ paddingTop: "120px" }}>
        <section style={{ marginBottom: "var(--spacing-xl)" }}>
          <div
            style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "0.2em",
                color: "var(--primary)",
              }}
            >
              Our Story
            </span>
            <h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "var(--spacing-sm)",
                color: "var(--text)",
              }}
            >
              About <span style={{ color: "var(--primary)" }}>Salana</span>
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
                maxWidth: "650px",
                margin: "0 auto",
              }}
            >
              Discover the story behind Salana and our mission to transform
              beauty and wellness services
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--spacing-lg)",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(27, 59, 47, 0.5)",
                padding: "var(--spacing-lg)",
                borderRadius: "var(--border-radius-lg)",
              }}
            >
              <h2
                style={{
                  color: "var(--primary)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Our Mission
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: "1.8",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                At Salana, our mission is to revolutionize the beauty and
                wellness industry by creating a platform that connects clients
                with top-tier professionals. We believe everyone deserves access
                to quality services that enhance their well-being and
                confidence.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.8" }}>
                Through innovative technology and a curated selection of
                certified professionals, we strive to make booking beauty and
                wellness services as seamless and enjoyable as the services
                themselves.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "rgba(27, 59, 47, 0.5)",
                padding: "var(--spacing-lg)",
                borderRadius: "var(--border-radius-lg)",
              }}
            >
              <h2
                style={{
                  color: "var(--primary)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Our Vision
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.8" }}>
                We envision a world where accessing quality beauty and wellness
                services is effortless and transparent. Our platform aims to
                empower both clients and professionals, creating a community
                built on trust, expertise, and exceptional service.
              </p>
            </div>
          </div>
        </section>

        <section
          className={styles.featuresSection}
          style={{ padding: "var(--spacing-xl) 0" }}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>Core Values</span>
            <h2 className={styles.sectionTitle}>
              What <span className={styles.titleHighlight}>Drives Us</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              The principles that guide everything we do at Salana
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {[
              {
                title: "Excellence",
                desc: "We are committed to excellence in every aspect of our service",
              },
              {
                title: "Integrity",
                desc: "We operate with honesty and transparency in all our interactions",
              },
              {
                title: "Innovation",
                desc: "We constantly seek new ways to improve the beauty and wellness experience",
              },
              {
                title: "Inclusivity",
                desc: "We believe quality services should be accessible to everyone",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`${styles.featureCard} ${
                  styles[`delay${index + 1}`]
                } ${styles.animated}`}
              >
                <div
                  className={styles.cardCorner + " " + styles.cornerTopLeft}
                ></div>
                <div className={styles.featureIcon}>
                  <div className={styles.iconRing}></div>★
                </div>
                <h3 className={styles.featureTitle}>{value.title}</h3>
                <p className={styles.featureDescription}>{value.desc}</p>
                <div
                  className={styles.cardCorner + " " + styles.cornerBottomRight}
                ></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
