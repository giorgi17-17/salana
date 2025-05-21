import styles from "../../styles/components/HowItWorks.module.css";

function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Browse Services",
      description:
        "Explore a curated selection of beauty and wellness services near you.",
      icon: "🔍",
    },
    {
      id: 2,
      title: "Book Instantly",
      description:
        "Reserve your appointment with just a few clicks, no phone calls needed.",
      icon: "📅",
    },
    {
      id: 3,
      title: "Enjoy Your Experience",
      description:
        "Relax and enjoy your premium service with a verified professional.",
      icon: "✨",
    },
  ];

  return (
    <section className={styles.howSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>
          Your journey to relaxation is just three simple steps away
        </p>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.id} className={styles.stepContainer}>
              <div className={styles.iconContainer}>
                <div className={styles.iconCircle}>{step.icon}</div>
                {step.id < steps.length && (
                  <div className={styles.connector}></div>
                )}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
