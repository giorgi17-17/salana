import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getImageUrl } from "../lib/storageUtils";
import styles from "../styles/pages/SalonListing.module.css";
import buttonStyles from "../styles/components/Button.module.css";

function SalonListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch businesses from Supabase
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data: businesses, error } = await supabase
        .from("businesses")
        .select(
          `
          *,
          business_locations(*),
          business_services(*),
          business_stylists(*)
        `
        )
        .eq("status", "approved")
        .order("featured", { ascending: false });

      if (error) {
        setError("სალონების ჩატვირთვისას მოხდა შეცდომა");
        console.error("Error fetching businesses:", error);
        return;
      }

      // Transform database data to match expected format
      const transformedSalons = businesses.map((business) => ({
        id: business.id,
        name: business.name,
        description: business.description || "",
        address:
          business.business_locations?.[0]?.address ||
          "მისამართი მითითებული არ არის",
        phone: business.phone || "",
        email: business.email || "",
        rating: business.rating || 0,
        reviewCount: business.review_count || 0,
        featured: business.featured || false,
        image: business.image || "",
        services:
          business.business_services?.map((service) => ({
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.duration,
            description: service.description,
          })) || [],
        stylists:
          business.business_stylists?.map((stylist) => ({
            id: stylist.id,
            name: stylist.name,
            specialty: stylist.specialty,
            experience: stylist.experience,
          })) || [],
      }));

      setSalons(transformedSalons);
    } catch (error) {
      setError("სალონების ჩატვირთვისას მოხდა შეცდომა");
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

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
      salon.services.some((service) =>
        service.name.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    );
  });

  // Get unique service categories
  const serviceCategories = [
    ...new Set(
      salons.flatMap((salon) => salon.services.map((service) => service.name))
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
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className={styles.loading}>
            <p>სალონები იტვირთება...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button
              onClick={fetchBusinesses}
              className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            >
              ხელახლა სცადე
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredSalons.filter((salon) => salon.featured).length > 0 && (
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
            )}

            <div className={styles.allSalonsSection}>
              <h2 className={styles.sectionTitle}>
                {filteredSalons.filter((salon) => salon.featured).length > 0
                  ? "ყველა სალონი"
                  : "სალონები"}
              </h2>
              <div className={styles.salonGrid}>
                {filteredSalons
                  .filter((salon) => !salon.featured)
                  .map((salon) => (
                    <SalonCard key={salon.id} salon={salon} />
                  ))}
              </div>
            </div>

            {filteredSalons.length === 0 && salons.length > 0 && (
              <div className={styles.noResults}>
                <p>სამწუხაროდ, თქვენი ძიების შედეგად სალონები ვერ მოიძებნა.</p>
              </div>
            )}

            {salons.length === 0 && !loading && (
              <div className={styles.noResults}>
                <p>ჯერ არ არის დარეგისტრირებული სალონები.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// SalonCard component
function SalonCard({ salon }) {
  const imageUrl = getImageUrl(salon.image);

  return (
    <div className={styles.salonCard}>
      <div className={styles.salonImageContainer}>
        <div className={styles.salonImagePlaceholder}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={salon.name}
              className={styles.salonImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className={styles.noImagePlaceholder}>
              <span>სურათი არ არის</span>
            </div>
          )}
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
