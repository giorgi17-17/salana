import styles from "../../styles/components/PopularServices.module.css";

function PopularServices() {
  const services = [
    {
      id: 1,
      name: "Hair Styling",
      icon: "✂️",
      description: "Professional cuts, color, and styling",
    },
    {
      id: 2,
      name: "Nail Care",
      icon: "💅",
      description: "Manicures, pedicures, and nail art",
    },
    {
      id: 3,
      name: "Massage & Spa",
      icon: "💆",
      description: "Relaxing treatments for mind and body",
    },
    {
      id: 4,
      name: "Skincare & Facials",
      icon: "✨",
      description: "Rejuvenating treatments for healthy skin",
    },
    {
      id: 5,
      name: "Wellness & Yoga",
      icon: "🧘",
      description: "Classes and sessions for overall wellness",
    },
  ];

  return (
    <section className={styles.servicesSection}>
      {/* Decorative elements */}
      <div className={styles.topDivider}></div>
      <div className={styles.bottomDivider}></div>

      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleText}>Popular Services</span>
            <span className={styles.titleUnderline}></span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Discover our most booked services from verified professionals near
            you
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={styles.serviceCard}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.iconContainer}>
                <div className={styles.iconWrapper}>{service.icon}</div>
              </div>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularServices;
