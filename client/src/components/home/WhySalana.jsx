import styles from "../../styles/components/WhySalana.module.css";
import { CheckCircle, Calendar, Layers, Star } from "lucide-react";
import { useState } from "react";

function WhySalana() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      title: "Verified Professionals",
      description:
        "Every service provider is carefully vetted for quality and professionalism.",
      icon: <CheckCircle size={28} strokeWidth={2} />,
      color: "#7ee28b", // green
    },
    {
      id: 2,
      title: "Seamless Booking",
      description:
        "Book and manage appointments with ease through our intuitive platform.",
      icon: <Calendar size={28} strokeWidth={2} />,
      color: "#66d3fa", // light blue
    },
    {
      id: 3,
      title: "Elegant User Interface",
      description:
        "Enjoy a beautiful and intuitive experience designed with your needs in mind.",
      icon: <Layers size={28} strokeWidth={2} />,
      color: "#7c6df0", // purple
    },
    {
      id: 4,
      title: "Real User Reviews",
      description:
        "Make informed decisions with authentic ratings and reviews from real clients.",
      icon: <Star size={28} strokeWidth={2} />,
      color: "#ffa857", // orange
    },
  ];

  return (
    <section className={styles.whySection}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-lg)" }}>
          <h2 className={styles.sectionTitle}>Why Salana</h2>
          <p className={styles.sectionSubtitle}>
            Experience the difference with our premium booking platform
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`${styles.featureCard}`}
              style={{
                animation: `${styles.fadeUp} 0.6s ease-out both`,
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={styles.featureIcon}
                style={{
                  color: feature.color,
                  backgroundColor: `${feature.color}15`,
                  borderColor: `${feature.color}30`,
                  transform:
                    hoveredCard === feature.id
                      ? "scale(1.1) rotate(5deg)"
                      : "none",
                }}
              >
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySalana;
