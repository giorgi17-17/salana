import { useState } from "react";
import { Link } from "react-router-dom";
import salons from "../data/salons";
import styles from "../styles/pages/SalonListing.module.css";
import buttonStyles from "../styles/components/Button.module.css";

function SalonListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter by search term and category
  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === "all") {
      return matchesSearch;
    }

    // Check if salon has the selected service category
    return (
      matchesSearch &&
      salon.services.some((service) => service.id === selectedCategory)
    );
  });

  // Get unique service categories
  const serviceCategories = [
    ...new Set(
      salons.flatMap((salon) => salon.services.map((service) => service.id))
    ),
  ];

  return (
    <section className="container">
      <div className={styles.salonListingContainer}>
        <h1 className={styles.pageTitle}>სილამაზის სალონები</h1>
        <p className={styles.pageDescription}>
          აირჩიეთ სასურველი სალონი და დაჯავშნეთ თქვენი ვიზიტი
        </p>

        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="ძიება..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categoryFilters}>
            <button
              className={`${styles.categoryButton} ${
                selectedCategory === "all" ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              ყველა
            </button>

            {serviceCategories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "haircut" && "თმის შეჭრა"}
                {category === "color" && "შეღებვა"}
                {category === "styling" && "სტაილინგი"}
                {category === "treatment" && "მკურნალობა"}
                {category === "manicure" && "მანიკური"}
                {category === "pedicure" && "პედიკური"}
                {category === "facial" && "სახის მოვლა"}
                {category === "massage" && "მასაჟი"}
                {category === "shave" && "საპარსი"}
                {category === "gel" && "გელ-ლაკი"}
                {category === "nail_art" && "ნეილ არტი"}
                {category === "body_wrap" && "სხეულის შეფუთვა"}
                {category === "package" && "პაკეტები"}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>რჩეული სალონები</h2>
          <div className={styles.salonGrid}>
            {filteredSalons
              .filter((salon) => salon.featured)
              .map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
          </div>
        </div>

        <div className={styles.allSalonsSection}>
          <h2 className={styles.sectionTitle}>ყველა სალონი</h2>
          <div className={styles.salonGrid}>
            {filteredSalons
              .filter((salon) => !salon.featured)
              .map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
          </div>
        </div>

        {filteredSalons.length === 0 && (
          <div className={styles.noResults}>
            <p>სამწუხაროდ, თქვენი ძიების შედეგად სალონები ვერ მოიძებნა.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// SalonCard component
function SalonCard({ salon }) {
  return (
    <div className={styles.salonCard}>
      <div className={styles.salonImageContainer}>
        <div className={styles.salonImagePlaceholder}>
          {/* Replace with actual image later */}
        </div>
        <div className={styles.salonRating}>
          <span className={styles.ratingValue}>{salon.rating}</span>
          <span className={styles.reviewCount}>({salon.reviewCount})</span>
        </div>
      </div>

      <div className={styles.salonInfo}>
        <h3 className={styles.salonName}>{salon.name}</h3>
        <p className={styles.salonDescription}>{salon.description}</p>
        <div className={styles.salonAddress}>{salon.address}</div>

        <div className={styles.servicesPreview}>
          {salon.services.slice(0, 3).map((service, index) => (
            <span key={service.id} className={styles.serviceTag}>
              {service.name}
              {index < Math.min(salon.services.length, 3) - 1 && ", "}
            </span>
          ))}
          {salon.services.length > 3 && (
            <span className={styles.serviceTag}>
              +{salon.services.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className={styles.salonActions}>
        <Link to={`/salon/${salon.id}`} className={styles.detailsLink}>
          <button
            className={`${buttonStyles.button} ${buttonStyles.secondary}`}
          >
            დეტალები
          </button>
        </Link>
        <Link to={`/booking/${salon.id}`} className={styles.bookingLink}>
          <button className={`${buttonStyles.button} ${buttonStyles.primary}`}>
            დაჯავშნა
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SalonListing;
