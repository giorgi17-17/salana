import { useState } from "react";
import styles from "../../styles/pages/Pricing.module.css";

function PricingFAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "შემიძლია ნებისმიერ დროს შევცვალო გეგმა?",
      answer:
        "დიახ! შეგიძლიათ ნებისმიერ დროს გააუმჯობესოთ ან დაწყვეტოთ თქვენი გეგმა. ცვლილებები მაშინვე ძალაში შედის და ჩვენ პროპორციულად დავუბრუნებთ ბილინგის განსხვავებას.",
    },
    {
      question: "რა მოხდება, თუ გადავაჭარბებ ჩემი გეგმის ლიმიტებს?",
      answer:
        "ჩვენ გაცნობებთ, როცა ლიმიტებს უახლოვდებით. შეგიძლიათ გააუმჯობესოთ თქვენი გეგმა ან დაგეხმარებით ამჟამინდელი კონფიგურაციის ოპტიმიზაციაში ლიმიტების ფარგლებში დარჩენისთვის.",
    },
    {
      question: "გთავაზობთ ფულის დაბრუნებას?",
      answer:
        "დიახ, ჩვენ ვთავაზობთ 14-დღიანი ფულის დაბრუნების გარანტიას ყველა ფასიანი გეგმისთვის. თუ არ ხართ კმაყოფილი, დაგვიკავშირდით სრული ფულის დაბრუნებისთვის.",
    },
    {
      question: "ჩემი მონაცემები უსაფრთხოდ არის დაცული?",
      answer:
        "აბსოლუტურად. ჩვენ ვიყენებთ ინდუსტრიული სტანდარტის შიფრაციას და უსაფრთხოების პრაქტიკას. თქვენი მონაცემები უსაფრთხოდ არის შენახული Supabase-ში და ყოველთვის არის რეზერვირებული.",
    },
    {
      question: "შემიძლია მახასიათებლების ტესტირება გაუმჯობესებამდე?",
      answer:
        "დიახ! დაიწყეთ ჩვენი უფასო დამწყები გეგმით ძირითადი მახასიათებლების ტესტირებისთვის. ნებისმიერ დროს შეგიძლიათ გაუმჯობესება მოწინავე მახასიათებლებზე წვდომისთვის, როგორიცაა კალენდრის სინქრონიზაცია და SMS შეხსენებები.",
    },
    {
      question: "რა გადახდის მეთოდებს ღებულობთ?",
      answer:
        "ჩვენ ვღებულობთ ყველა ძირითად საკრედიტო ბარათს (Visa, MasterCard, American Express) და PayPal-ს. ყველა გადახდა უსაფრთხოდ მუშავდება Stripe-ის მეშვეობით.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className={styles.pricingFaq}>
      <div className="container">
        <div className={styles.pricingFaqHeader}>
          <h2>ხშირად დასმული კითხვები</h2>
          <p>ყველაფერი, რაც უნდა იცოდეთ ჩვენი ფასების და გეგმების შესახებ</p>
        </div>

        <div className={styles.pricingFaqGrid}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.pricingFaqItem} ${
                openFAQ === index ? styles.pricingFaqItemOpen : ""
              }`}
            >
              <button
                className={styles.pricingFaqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openFAQ === index}
              >
                <span>{faq.question}</span>
                <span className={styles.pricingFaqIcon}>
                  {openFAQ === index ? "−" : "+"}
                </span>
              </button>

              {openFAQ === index && (
                <div className={styles.pricingFaqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.pricingFaqContact}>
          <h3>კვლავ გაქვთ კითხვები?</h3>
          <p>
            დაუკავშირდით ჩვენს მხარდაჭერის გუნდს პერსონალიზებული დახმარებისთვის
          </p>
          <button className={styles.pricingFaqContactButton}>
            დაკავშირება მხარდაჭერასთან
          </button>
        </div>
      </div>
    </section>
  );
}

export default PricingFAQ;
