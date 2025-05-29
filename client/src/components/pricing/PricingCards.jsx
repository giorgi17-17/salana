import { useState } from "react";
import styles from "../../styles/pages/Pricing.module.css";

function PricingCards() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      name: "დამწყები",
      price: "უფასო",
      period: "",
      description: "იდეალურია სალანას ტესტირებისთვის",
      popular: false,
      features: [
        "ერთი ლოკაციის ჩამონათვალი",
        "მაქსიმუმ 3 სერვისი",
        "დაჯავშნების ნახვა",
        "შეზღუდული ანალიტიკა",
        "ძირითადი პროფილის გვერდი",
        "Supabase-ის მეშვეობით ავტორიზაცია",
      ],
      buttonText: "დაიწყეთ უფასოდ",
      buttonClass: `${styles.pricingCardButton} ${styles.pricingCardButtonOutlined}`,
    },
    {
      name: "პროფესიონალი",
      price: billingPeriod === "monthly" ? "₾29" : "₾290",
      period: billingPeriod === "monthly" ? "/თვე" : "/წელი",
      description: "იდეალურია მცირე სალონებისა და ფრილანსერებისთვის",
      popular: true,
      features: [
        "ყველაფერი დამწყებ გეგმაში",
        "მაქსიმუმ 3 თანამშრომელი",
        "20 სერვისი",
        "კალენდრის სინქრონიზაცია (Google, Apple)",
        "ელ.ფოსტით დაჯავშნის შეხსენება",
        "მიმოხილვების მართვა",
        "პრიორიტეტული მხარდაჭერა",
      ],
      buttonText: "დაიწყეთ პროფესიონალი",
      buttonClass: `${styles.pricingCardButton} ${styles.pricingCardButtonPrimary}`,
    },
    {
      name: "ბიზნეს+",
      price: billingPeriod === "monthly" ? "₾70" : "₾700",
      period: billingPeriod === "monthly" ? "/თვე" : "/წელი",
      description: "დიდი ან მრავალლოკაციური ბიზნესებისთვის",
      popular: false,
      features: [
        "ყველაფერი პროფესიონალ გეგმაში",
        "უსასრულო თანამშრომლები და სერვისები",
        "კასტომიზებული ბრენდინგი (ლოგო, ფერები)",
        "დეტალური ანალიტიკის პანელი",
        "SMS შეხსენებები",
        "კლიენტების CRM (შენიშვნები, ისტორია)",
        "გამორჩეული განცხადების პრიორიტეტი",
      ],
      buttonText: "დაიწყეთ ბიზნეს+",
      buttonClass: `${styles.pricingCardButton} ${styles.pricingCardButtonOutlined}`,
    },
  ];

  return (
    <section className={styles.pricingCards}>
      <div className="container">
        <div className={styles.pricingToggle}>
          <span className={billingPeriod === "monthly" ? styles.active : ""}>
            ყოველთვიური
          </span>
          <button
            className={styles.pricingToggleSwitch}
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "yearly" : "monthly"
              )
            }
            aria-label="ბილინგის პერიოდის შეცვლა"
            data-active={billingPeriod}
          >
            <span className={styles.pricingToggleSlider}></span>
          </button>
          <span className={billingPeriod === "yearly" ? styles.active : ""}>
            წლიური{" "}
            <span className={styles.pricingToggleDiscount}>დაზოგეთ 17%</span>
          </span>
        </div>

        <div className={styles.pricingGrid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.pricingCard} ${
                plan.popular ? styles.pricingCardPopular : ""
              }`}
            >
              {plan.popular && (
                <div className={styles.pricingCardBadge}>
                  ყველაზე პოპულარული
                </div>
              )}

              <div className={styles.pricingCardHeader}>
                <h3 className={styles.pricingCardName}>{plan.name}</h3>
                <div className={styles.pricingCardPrice}>
                  <span className={styles.pricingCardAmount}>{plan.price}</span>
                  <span className={styles.pricingCardPeriod}>
                    {plan.period}
                  </span>
                </div>
                <p className={styles.pricingCardDescription}>
                  {plan.description}
                </p>
              </div>

              <div className={styles.pricingCardFeatures}>
                <h4>მახასიათებლები:</h4>
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <span className={styles.pricingCardFeatureIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button className={plan.buttonClass}>{plan.buttonText}</button>
            </div>
          ))}
        </div>

        <div className={styles.pricingGuarantee}>
          <p>
            💰 <strong>14-დღიანი ფულის დაბრუნების გარანტია</strong> • ნებისმიერ
            დროს გაუქმება • დაყენების გადასახადები არ არის
          </p>
        </div>
      </div>
    </section>
  );
}

export default PricingCards;
