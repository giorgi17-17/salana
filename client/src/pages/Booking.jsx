import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import BookingProgress from "../components/booking/BookingProgress";
import ServiceSelection from "../components/booking/ServiceSelection";
import DateTimeSelection from "../components/booking/DateTimeSelection";
import StylistAndDetails from "../components/booking/StylistAndDetails";
import BookingSummary from "../components/booking/BookingSummary";
import salons from "../data/salons";

function Booking() {
  const { salonId } = useParams();
  const { user } = useAuth();
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // If no salon ID is provided, redirect to salons page
  if (!salonId && window.location.pathname === "/booking") {
    return <Navigate to="/salons" replace />;
  }

  // Find the selected salon based on the ID
  useEffect(() => {
    if (salonId) {
      fetchSalonData(salonId);
    }
  }, [salonId]);

  const fetchSalonData = async (id) => {
    try {
      // First try to find in database
      const { data: businessData, error } = await supabase
        .from("businesses")
        .select(
          `
          *,
          business_services(*),
          business_stylists(*)
        `
        )
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (businessData && !error) {
        // Use real business data from database
        setSelectedSalon({
          id: businessData.id,
          name: businessData.name,
          description: businessData.description,
          address:
            businessData.business_locations?.[0]?.address ||
            "მისამართი მითითებული არ არის",
          phone: businessData.phone,
          email: businessData.email,
          rating: businessData.rating,
          services:
            businessData.business_services?.map((service) => ({
              id: service.id,
              name: service.name,
              price: service.price,
              duration: service.duration,
              description: service.description,
            })) || [],
          stylists:
            businessData.business_stylists?.map((stylist) => ({
              id: stylist.id,
              name: stylist.name,
              specialty: stylist.specialty,
              experience: stylist.experience,
            })) || [],
        });
      } else {
        // Fallback to mock data if not found in database
        const salon = salons.find((s) => s.id === id);
        setSelectedSalon(salon);
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
      // Fallback to mock data
      const salon = salons.find((s) => s.id === id);
      setSelectedSalon(salon);
    }
  };

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Including confirmation screen

  // Form data state
  const [selectedService, setSelectedService] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Navigation functions
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle final form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Check if this is mock data or real business data
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          selectedSalon.id
        );

      if (!isUUID) {
        // This is mock data - show error message
        setSubmitError(
          "ჯავშნა შესაძლებელია მხოლოდ ნამდვილ სალონებზე. გთხოვთ დარეგისტრირდეთ როგორც ბიზნესი ან აირჩიოთ რეგისტრირებული სალონი."
        );
        return;
      }

      // Create separate booking records for each service
      const bookingPromises = selectedService.map(async (service) => {
        const bookingData = {
          business_id: selectedSalon.id,
          service_id: service.id,
          stylist_id: selectedStylist?.id,
          customer_user_id: user?.id || null,
          customer_name: userDetails.name,
          customer_email: userDetails.email,
          customer_phone: userDetails.phone,
          customer_notes: userDetails.notes,
          booking_date: selectedDate,
          booking_time: selectedTime,
          duration: service.duration,
          total_price: service.price,
          status: "pending",
        };

        return supabase
          .from("bookings")
          .insert([bookingData])
          .select()
          .single();
      });

      // Insert all bookings
      const results = await Promise.all(bookingPromises);
      const failedBookings = results.filter((result) => result.error);

      if (failedBookings.length > 0) {
        console.error(
          "Database errors:",
          failedBookings.map((r) => r.error)
        );
        setSubmitError(
          "ჯავშნის შექმნისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა."
        );
        return;
      }

      const data = results[0].data; // Use first booking for confirmation

      // Set submitted data for confirmation
      const serviceNames = selectedService.map((s) => s.name).join(", ");
      const totalPrice = selectedService.reduce(
        (total, service) => total + service.price,
        0
      );

      setSubmittedData({
        bookingId: data.id,
        salon: selectedSalon?.name || "",
        name: userDetails.name,
        service: serviceNames,
        services: selectedService, // Keep full service details
        date: selectedDate,
        time: selectedTime,
        stylist: selectedStylist?.name || "არ არის მითითებული",
        price: totalPrice,
      });

      // Move to confirmed state
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitError("ჯავშნის შექმნისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state for salon
  if (salonId && !selectedSalon) {
    return (
      <section className="container">
        <div className="booking-container">
          <div className="loading">იტვირთება სალონის ინფორმაცია...</div>
        </div>
      </section>
    );
  }

  // If the salon ID is invalid
  if (salonId && !selectedSalon && !isSubmitted) {
    return (
      <section className="container">
        <div className="booking-container">
          <div className="error-message">
            <h2>სალონი ვერ მოიძებნა</h2>
            <p>მითითებული სალონი არ არსებობს. გთხოვთ, სცადოთ სხვა სალონი.</p>
            <a href="/salons" className="back-link">
              დაბრუნება სალონების სიაში
            </a>
          </div>
        </div>
      </section>
    );
  }

  // If the booking is submitted, show the confirmation component
  if (isSubmitted) {
    return <BookingConfirmation bookingData={submittedData} />;
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            nextStep={nextStep}
            services={selectedSalon?.services}
          />
        );
      case 2:
        return (
          <DateTimeSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            nextStep={nextStep}
            prevStep={prevStep}
            businessId={selectedSalon?.id}
            selectedService={selectedService}
          />
        );
      case 3:
        return (
          <StylistAndDetails
            selectedStylist={selectedStylist}
            setSelectedStylist={setSelectedStylist}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            nextStep={nextStep}
            prevStep={prevStep}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            businessId={selectedSalon?.id}
            stylists={selectedSalon?.stylists}
          />
        );
      case 4:
        return (
          <BookingSummary
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedStylist={selectedStylist}
            userDetails={userDetails}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            salon={selectedSalon}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="container">
      <div className="booking-container">
        {selectedSalon && (
          <div className="salon-header">
            <h2 className="salon-name">{selectedSalon.name}</h2>
            <p className="salon-address">{selectedSalon.address}</p>
          </div>
        )}
        <BookingProgress currentStep={currentStep} totalSteps={totalSteps} />
        {renderStep()}
      </div>
    </section>
  );
}

export default Booking;
