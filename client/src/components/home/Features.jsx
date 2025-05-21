import styles from "../../styles/components/Features.module.css";
import { useState } from "react";
import { Shield, CreditCard, CheckCircle, Users } from "lucide-react";

function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Features data with Lucide icons
  const features = [
    {
      id: 1,
      title: "შერჩეული პროფესიონალები",
      description:
        "ჩვენ ყურადღებით ვარჩევთ და ვამოწმებთ ყველა სილამაზისა და ჯანმრთელობის პროფესიონალს ჩვენს პლატფორმაზე.",
      icon: <Users size={32} strokeWidth={2} />,
      color: "#7ee28b", // green
    },
    {
      id: 2,
      title: "უსაფრთხო ჯავშანი",
      description:
        "დაჯავშნეთ შეხვედრები უსაფრთხოდ და მიიღეთ დაუყოვნებლივი დადასტურება.",
      icon: <Shield size={32} strokeWidth={2} />,
      color: "#7c6df0", // purple
    },
    {
      id: 3,
      title: "ხარისხიანი მომსახურება",
      description:
        "ისარგებლეთ მუდმივად მაღალი ხარისხის მომსახურებით სერტიფიცირებული ექსპერტებისგან.",
      icon: <CheckCircle size={32} strokeWidth={2} />,
      color: "#66d3fa", // light blue
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.topDivider}></div>
      <div className={styles.bottomDivider}></div>

      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>რატომ უნდა აგვირჩიოთ</span>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleHighlight}>Salana</span>-ს განსხვავება
          </h2>
          <p className={styles.sectionSubtitle}>
            რა ხდის ჩვენს პლატფორმას საუკეთესო არჩევანს თქვენი სილამაზისა და
            ჯანმრთელობის საჭიროებებისთვის
          </p>
        </div>

        <div className={`${styles.featuresGrid} ${styles.threeCardLayout}`}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`${styles.featureCard} ${
                styles[`delay${index + 1}`]
              } ${styles.animated} ${styles.premium}`}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`${styles.cardCorner} ${styles.cornerTopLeft}`}
                style={{ borderColor: feature.color }}
              ></div>
              <div
                className={styles.featureIcon}
                style={{
                  color: feature.color,
                  backgroundColor: `${feature.color}15`,
                  transform:
                    hoveredCard === feature.id
                      ? "scale(1.1) rotate(5deg)"
                      : "scale(1)",
                  boxShadow:
                    hoveredCard === feature.id
                      ? `0 8px 24px ${feature.color}30`
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className={styles.iconRing}
                  style={{
                    borderColor: feature.color,
                    boxShadow: `0 0 12px ${feature.color}40`,
                  }}
                ></div>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <div
                className={`${styles.cardCorner} ${styles.cornerBottomRight}`}
                style={{ borderColor: feature.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
