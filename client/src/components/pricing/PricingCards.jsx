import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/pages/Pricing.module.css";

function PricingCards() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [businessId, setBusinessId] = useState(null);
  const { user } = useAuth();

  // Get business ID for the current user
  useEffect(() => {
    const fetchBusinessId = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching business:", error);
        } else {
          setBusinessId(data?.id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBusinessId();
  }, [user]);

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
      price: billingPeriod === "monthly" ? "₾1" : "₾10",
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
  const handlePay = async (plan) => {
    try {
      // Skip payment for free plan
      if (plan.name === "დამწყები") {
        alert("უფასო გეგმა - გადახდა არ არის საჭირო!");
        return;
      }

      // Check if user is authenticated and has a business
      if (!user) {
        alert("გთხოვთ შედით ანგარიშში");
        return;
      }

      if (!businessId) {
        alert("ბიზნეს ანგარიში ვერ მოიძებნა. გთხოვთ შექმნათ ბიზნეს პროფილი.");
        return;
      }

      // Get amount based on plan and billing period
      let amount;
      if (plan.name === "პროფესიონალი") {
        amount = billingPeriod === "monthly" ? 1 : 10;
      } else if (plan.name === "ბიზნეს+") {
        amount = billingPeriod === "monthly" ? 70 : 700;
      }

      console.log("Creating subscription order for:", plan.name, amount);

      const res = await fetch("http://localhost:3001/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          userId: businessId, // Using actual business ID from auth
          isSubscription: true,
          productId: plan.name,
          externalOrderId: `${plan.name}-${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Failed to redirect to payment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

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

              <button
                className={plan.buttonClass}
                onClick={() => handlePay(plan)}
              >
                {plan.name === "დამწყები" ? "დაიწყეთ უფასოდ" : "ყიდვა"}
              </button>
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
