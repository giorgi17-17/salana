import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { getImageUrl } from "../lib/storageUtils";
import salons from "../data/salons";
import styles from "../styles/pages/SalonDetail.module.css";
import buttonStyles from "../styles/components/Button.module.css";

function SalonDetail() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("all");

  useEffect(() => {
    fetchSalonData();
  }, [salonId]);

  const fetchSalonData = async () => {
    try {
      // First try to fetch from database
      const { data: business, error } = await supabase
        .from("businesses")
        .select(
          `
          *,
          business_locations(*),
          business_services(*),
          business_stylists(*)
        `
        )
        .eq("id", salonId)
        .eq("status", "approved")
        .single();

      if (!error && business) {
        // Transform database data to match expected format
        const transformedSalon = {
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
          locations:
            business.business_locations?.map((location) => ({
              id: location.id,
              name: location.name,
              address: location.address,
              location_url: location.location_url,
              image: location.image,
            })) || [],
          openHours: {
            mon_fri: "10:00 - 20:00", // Default hours, should be in database
            sat: "11:00 - 19:00",
            sun: "დასვენება",
          },
        };

        setSalon(transformedSalon);
      } else {
        // Fallback to mock data if not found in database
        const foundSalon = salons.find((s) => s.id === salonId);
        if (foundSalon) {
          setSalon(foundSalon);
        }
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
      // Fallback to mock data
      const foundSalon = salons.find((s) => s.id === salonId);
      if (foundSalon) {
        setSalon(foundSalon);
      }
    }
  };

  // If salon not found
  if (!salon) {
    return (
      <section className="container">
        <div className={styles.notFound}>
          <h2>სალონი ვერ მოიძებნა</h2>
          <p>მითითებული სალონი არ არსებობს.</p>
          <Link to="/salons">
            <button
              className={`${buttonStyles.button} ${buttonStyles.primary}`}
            >
              დაბრუნება სალონების სიაში
            </button>
          </Link>
        </div>
      </section>
    );
  }

  // Filter services by category
  const filteredServices =
    selectedServiceCategory === "all"
      ? salon.services
      : salon.services.filter(
          (service) => service.id === selectedServiceCategory
        );

  // Get unique service categories
  const serviceCategories = [
    ...new Set(salon.services.map((service) => service.id)),
  ];

  // Format opening hours
  const formatOpenHours = (openHours) => {
    const formatted = [];
    Object.entries(openHours).forEach(([key, value]) => {
      switch (key) {
        case "mon_fri":
          formatted.push(`ორშაბათი-პარასკევი: ${value}`);
          break;
        case "sat":
          formatted.push(`შაბათი: ${value}`);
          break;
        case "sun":
          formatted.push(`კვირა: ${value}`);
          break;
        case "sat_sun":
          formatted.push(`შაბათი-კვირა: ${value}`);
          break;
        case "mon_sat":
          formatted.push(`ორშაბათი-შაბათი: ${value}`);
          break;
        case "all_days":
          formatted.push(`ყოველდღე: ${value}`);
          break;
        case "mon_sun":
          formatted.push(`ყოველდღე: ${value}`);
          break;
        default:
          formatted.push(`${key}: ${value}`);
      }
    });
    return formatted;
  };

  return (
    <section className="container">
      <div className={styles.salonDetailContainer}>
        {/* Back Navigation */}
        <div className={styles.backNavigation}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← უკან
          </button>
          <Link to="/salons" className={styles.breadcrumb}>
            სალონები
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.currentPage}>{salon.name}</span>
        </div>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.salonImageContainer}>
            <div className={styles.salonImagePlaceholder}>
              {salon.image ? (
                <img
                  src={getImageUrl(salon.image)}
                  alt={salon.name}
                  className={styles.salonHeroImage}
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
            <div className={styles.ratingBadge}>
              <span className={styles.rating}>⭐ {salon.rating}</span>
              <span className={styles.reviewCount}>
                ({salon.reviewCount} შეფასება)
              </span>
            </div>
          </div>

          <div className={styles.salonHeader}>
            <h1 className={styles.salonName}>{salon.name}</h1>
            <p className={styles.salonDescription}>{salon.description}</p>

            <div className={styles.quickActions}>
              <Link to={`/booking/${salon.id}`}>
                <button
                  className={`${buttonStyles.button} ${buttonStyles.primary} `}
                >
                  დაჯავშნე ახლავე
                </button>
              </Link>
              <a href={`tel:${salon.phone}`}>
                <button
                  className={`${buttonStyles.button} ${buttonStyles.secondary} `}
                >
                  დარეკვა
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Services Section */}
          <div className={styles.servicesSection}>
            <h2 className={styles.sectionTitle}>სერვისები</h2>

            {/* Service Category Filters */}
            <div className={styles.serviceFilters}>
              <button
                className={`${styles.filterButton} ${
                  selectedServiceCategory === "all" ? styles.active : ""
                }`}
                onClick={() => setSelectedServiceCategory("all")}
              >
                ყველა
              </button>
              {serviceCategories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterButton} ${
                    selectedServiceCategory === category ? styles.active : ""
                  }`}
                  onClick={() => setSelectedServiceCategory(category)}
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

            {/* Services Grid */}
            <div className={styles.servicesGrid}>
              {filteredServices.map((service) => (
                <div key={service.id} className={styles.serviceCard}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <div className={styles.serviceDetails}>
                    <span className={styles.servicePrice}>
                      {service.price} ₾
                    </span>
                    <span className={styles.serviceDuration}>
                      {service.duration} წუთი
                    </span>
                  </div>
                  <Link to={`/booking/${salon.id}?service=${service.id}`}>
                    <button
                      className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small}`}
                    >
                      დაჯავშნა
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Stylists Section */}
          {salon.stylists && salon.stylists.length > 0 && (
            <div className={styles.stylistsSection}>
              <h2 className={styles.sectionTitle}>ჩვენი გუნდი</h2>
              <div className={styles.stylistsGrid}>
                {salon.stylists.map((stylist) => (
                  <div key={stylist.id} className={styles.stylistCard}>
                    <div className={styles.stylistImagePlaceholder}></div>
                    <div className={styles.stylistInfo}>
                      <h3 className={styles.stylistName}>{stylist.name}</h3>
                      <p className={styles.stylistSpecialty}>
                        {stylist.specialty}
                      </p>
                      <p className={styles.stylistExperience}>
                        გამოცდილება: {stylist.experience}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>საკონტაქტო ინფორმაცია</h3>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>მისამართი:</span>
                <span className={styles.infoValue}>{salon.address}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ტელეფონი:</span>
                <a href={`tel:${salon.phone}`} className={styles.phoneLink}>
                  {salon.phone}
                </a>
              </div>
              {salon.email && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>ელ. ფოსტა:</span>
                  <a
                    href={`mailto:${salon.email}`}
                    className={styles.emailLink}
                  >
                    {salon.email}
                  </a>
                </div>
              )}
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>სამუშაო საათები</h3>
              {formatOpenHours(salon.openHours).map((schedule, index) => (
                <div key={index} className={styles.scheduleItem}>
                  {schedule}
                </div>
              ))}
            </div>

            {salon.locations && salon.locations.length > 0 && (
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>ლოკაცია</h3>
                {salon.locations.map((location) => (
                  <div key={location.id} className={styles.locationItem}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>მისამართი:</span>
                      <span className={styles.infoValue}>
                        {location.address}
                      </span>
                    </div>
                    {location.location_url && (
                      <a
                        href={location.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mapLink}
                      >
                        რუკაზე ნახვა
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SalonDetail;
