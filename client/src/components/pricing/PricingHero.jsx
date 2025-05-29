import styles from "../../styles/pages/Pricing.module.css";

function PricingHero() {
  return (
    <section className={styles.pricingHero}>
      <div className="container">
        <div className={styles.pricingHeroContent}>
          <h1>აირჩიეთ თქვენი სრულყოფილი გეგმა</h1>
          <p className={styles.pricingHeroDescription}>
            გაუმჯობესეთ თქვენი სალონის ბიზნესი სალანასთან. დაიწყეთ უფასოდ და
            გაიზარდეთ ზრდასთან ერთად. ყველა გეგმა მოიცავს ჩვენს ძირითად
            დაჯავშნის სისტემას და მომხმარებელთა მართვის ხელსაწყოებს.
          </p>
          <div className={styles.pricingHeroBadge}>
            <span>
              🎉 დაიწყეთ ჩვენი უფასო გეგმით - საკრედიტო ბარათი არ საჭიროება
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingHero;
