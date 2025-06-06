import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import BusinessServices from "../components/dashboard/Services";
import BusinessStylists from "../components/dashboard/Stylists";
import BusinessLocations from "../components/dashboard/Locations";
import BusinessHours from "../components/dashboard/Hours";
import BusinessBookings from "../components/dashboard/Bookings";
import BookingVisuals from "../components/dashboard/BookingVisuals";
import BusinessInfo from "../components/dashboard/BusinessInfo";

function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/business/login");
      return;
    }

    if (user) {
      fetchBusinessData();
    }
  }, [user, authLoading, navigate]);

  const fetchBusinessData = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(
          `
          *,
          business_locations(*),
          business_services(*),
          business_stylists(*),
          business_hours(*)
        `
        )
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching business:", error);
      } else {
        setBusiness(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBusinessData = () => {
    fetchBusinessData();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      suspended: styles.statusSuspended,
    };

    const statusText = {
      pending: "განხილვაში",
      approved: "დამტკიცებული",
      suspended: "შეჩერებული",
    };

    return (
      <span className={`${styles.statusBadge} ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>იტვირთება...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>ბიზნეს პანელი</h1>
          <div className={styles.userInfo}>
            <span>
              მოგესალმებით, {user?.user_metadata?.businessName || user?.email}
            </span>
            <button onClick={handleSignOut} className={styles.signOutBtn}>
              გასვლა
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            <button
              className={`${styles.navItem} ${
                activeTab === "overview" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              მიმოხილვა
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "business" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("business")}
            >
              ბიზნეს ინფო
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "services" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("services")}
            >
              სერვისები
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "stylists" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("stylists")}
            >
              სტილისტები
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "locations" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("locations")}
            >
              ლოკაციები
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "hours" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("hours")}
            >
              გრაფიკი
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "bookings" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              ჯავშნები
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === "booking-visuals" ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveTab("booking-visuals")}
            >
              კალენდარი
            </button>
          </nav>
        </div>

        <div className={styles.main}>
          {!business ? (
            <div className={styles.noBusiness}>
              <h2>ბიზნესი არ არის რეგისტრირებული</h2>
              <p>თქვენ ჯერ არ გაქვთ რეგისტრირებული ბიზნეს ანგარიში.</p>
              <button
                className={styles.createBusinessBtn}
                onClick={() => navigate("/business/register")}
              >
                ბიზნესის შექმნა
              </button>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className={styles.overview}>
                  <div className={styles.businessCard}>
                    <div className={styles.businessHeader}>
                      <h2>{business.name}</h2>
                      {getStatusBadge(business.status)}
                    </div>
                    <p className={styles.businessDescription}>
                      {business.description}
                    </p>

                    <div className={styles.statsGrid}>
                      <div className={styles.statCard}>
                        <h3>რეიტინგი</h3>
                        <div className={styles.statValue}>
                          {business.rating || "0"} ★
                        </div>
                        <div className={styles.statSubtext}>
                          {business.review_count || 0} შეფასება
                        </div>
                      </div>

                      <div className={styles.statCard}>
                        <h3>სერვისები</h3>
                        <div className={styles.statValue}>
                          {business.business_services?.length || 0}
                        </div>
                      </div>

                      <div className={styles.statCard}>
                        <h3>სტილისტები</h3>
                        <div className={styles.statValue}>
                          {business.business_stylists?.length || 0}
                        </div>
                      </div>

                      <div className={styles.statCard}>
                        <h3>ლოკაციები</h3>
                        <div className={styles.statValue}>
                          {business.business_locations?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <BusinessInfo
                  business={business}
                  onBusinessChange={(updatedBusiness) => {
                    setBusiness(updatedBusiness);
                    refreshBusinessData();
                  }}
                />
              )}

              {activeTab === "services" && (
                <BusinessServices
                  businessId={business.id}
                  initialServices={business.business_services || []}
                  onServicesChange={refreshBusinessData}
                />
              )}

              {activeTab === "stylists" && (
                <BusinessStylists
                  businessId={business.id}
                  initialStylists={business.business_stylists || []}
                  onStylistsChange={refreshBusinessData}
                />
              )}

              {activeTab === "locations" && (
                <BusinessLocations
                  businessId={business.id}
                  initialLocations={business.business_locations || []}
                  onLocationsChange={refreshBusinessData}
                />
              )}

              {activeTab === "hours" && (
                <BusinessHours
                  businessId={business.id}
                  initialHours={business.business_hours || []}
                  onHoursChange={refreshBusinessData}
                />
              )}

              {activeTab === "bookings" && (
                <BusinessBookings
                  businessId={business.id}
                  onBookingsChange={refreshBusinessData}
                />
              )}

              {activeTab === "booking-visuals" && (
                <BookingVisuals businessId={business.id} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
