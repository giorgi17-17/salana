import styles from "../../styles/components/Services.module.css";
import { useState } from "react";
import {
  Scissors,
  Brush,
  Sparkles,
  HeartHandshake,
  Palette,
  Leaf,
  Droplets,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

function Services() {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sample services data with Lucide icons
  const [services] = useState([
    {
      id: 1,
      name: "თმის სტილიზაცია",
      description:
        "პროფესიონალური თმის სტილიზაციის სერვისები, მორგებული თქვენს უნიკალურ სტილსა და უპირატესობებზე.",
      icon: <Scissors size={28} strokeWidth={2} />,
      category: "თმა",
      color: "#e87c99", // pink
    },
    {
      id: 2,
      name: "ფრჩხილის მოვლა",
      description:
        "ფუფუნების მანიკური და პედიკური პრემიუმ პროდუქტების გამოყენებით ლამაზი, ჯანსაღი ფრჩხილებისთვის.",
      icon: <Brush size={28} strokeWidth={2} />,
      category: "ფრჩხილები",
      color: "#7c6df0", // purple
    },
    {
      id: 3,
      name: "სახის პროცედურები",
      description:
        "გამაახალგაზრდავებელი სახის პროცედურები თქვენი კანის გასაწმენდად, აქერცვლისთვის და კვებისთვის.",
      icon: <Sparkles size={28} strokeWidth={2} />,
      category: "კანის მოვლა",
      color: "#66d3fa", // light blue
    },
    {
      id: 4,
      name: "მასაჟის თერაპია",
      description:
        "თერაპიული მასაჟის ტექნიკები დაძაბულობის მოსახსნელად და რელაქსაციის ხელშესაწყობად.",
      icon: <HeartHandshake size={28} strokeWidth={2} />,
      category: "გაჯანსაღება",
      color: "#5dd39e", // teal
    },
    {
      id: 5,
      name: "პროფესიონალური მაკიაჟი",
      description:
        "ექსპერტის მიერ მაკიაჟის გაკეთება განსაკუთრებული შემთხვევებისთვის ან ყოველდღიური მომხიბვლელობისთვის.",
      icon: <Palette size={28} strokeWidth={2} />,
      category: "მაკიაჟი",
      color: "#ffa857", // orange
    },
    {
      id: 6,
      name: "სპა პაკეტები",
      description:
        "ყოვლისმომცველი სპა პაკეტები საბოლოო რელაქსაციისა და განებივრების გამოცდილებისთვის.",
      icon: <Leaf size={28} strokeWidth={2} />,
      category: "სპა",
      color: "#7ee28b", // green
    },
    {
      id: 7,
      name: "კანის მოვლის კონსულტაცია",
      description:
        "პერსონალიზებული რჩევები კანის მოვლის შესახებ და პროცედურები სერტიფიცირებული კანის მოვლის სპეციალისტებისგან.",
      icon: <Droplets size={28} strokeWidth={2} />,
      category: "კანის მოვლა",
      color: "#66d3fa", // light blue (same as other skincare)
    },
    {
      id: 8,
      name: "გამაჯანსაღებელი ქოუჩინგი",
      description:
        "ჰოლისტიკური გამაჯანსაღებელი ქოუჩინგი, რომელიც დაგეხმარებათ სხეულისა და გონების ბალანსის მიღწევაში.",
      icon: <Dumbbell size={28} strokeWidth={2} />,
      category: "გაჯანსაღება",
      color: "#5dd39e", // teal (same as other wellness)
    },
  ]);

  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            პოპულარული <span className={styles.titleHighlight}>სერვისები</span>
          </h2>
          <div className={styles.divider}></div>
          <p className={styles.sectionSubtitle}>
            აღმოაჩინეთ ჩვენი ყველაზე მოთხოვნადი სილამაზისა და გამაჯანსაღებელი
            სერვისები
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`${styles.serviceCard} ${
                styles[`delay${(index % 4) + 1}`]
              } ${styles.animated}`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={styles.cardContent}>
                <span
                  className={styles.categoryBadge}
                  style={{
                    backgroundColor: `${service.color}20`,
                    color: service.color,
                  }}
                >
                  {service.category}
                </span>
                <div
                  className={styles.iconContainer}
                  style={{
                    backgroundColor: `${service.color}15`,
                    borderColor: `${service.color}30`,
                    transform:
                      hoveredCard === service.id
                        ? "scale(1.1) rotate(5deg)"
                        : "none",
                  }}
                >
                  <div
                    className={styles.iconCircle}
                    style={{
                      color: service.color,
                      backgroundColor:
                        hoveredCard === service.id
                          ? `${service.color}20`
                          : "rgba(27, 59, 47, 0.6)",
                    }}
                  >
                    {service.icon}
                  </div>
                </div>
                <h3 className={styles.serviceName}>{service.name}</h3>
                {/* <p className={styles.serviceDescription}>
                  {service.description}
                </p> */}
                <div className={styles.cardFooter}>
                  <a
                    href="#"
                    className={styles.exploreLink}
                    style={{
                      color: service.color,
                      gap: hoveredCard === service.id ? "0.5rem" : "0.25rem",
                    }}
                  >
                    დაჯავშნე ახლავე
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
