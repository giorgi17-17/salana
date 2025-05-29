import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import BookingProgress from "../components/booking/BookingProgress";
import ServiceSelection from "../components/booking/ServiceSelection";
import DateTimeSelection from "../components/booking/DateTimeSelection";
import StylistAndDetails from "../components/booking/StylistAndDetails";
import BookingSummary from "../components/booking/BookingSummary";
import salons from "../data/salons";

function Booking() {
  const { salonId } = useParams();
  const [selectedSalon, setSelectedSalon] = useState(null);

  // If no salon ID is provided, redirect to salons page
  if (!salonId && window.location.pathname === "/booking") {
    return <Navigate to="/salons" replace />;
  }

  // Find the selected salon based on the ID
  useEffect(() => {
    if (salonId) {
      const salon = salons.find((s) => s.id === salonId);
      setSelectedSalon(salon);
    }
  }, [salonId]);

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Including confirmation screen

  // Form data state
  const [selectedService, setSelectedService] = useState(null);
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

    try {
      // Prepare the full booking data
      const bookingData = {
        salon: selectedSalon
          ? {
              id: selectedSalon.id,
              name: selectedSalon.name,
            }
          : null,
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        stylist: selectedStylist,
        client: userDetails,
      };

      // For now, we'll just log the booking data
      console.log("Booking data:", bookingData);

      // In the future, you'll add database integration here

      // Set submitted data for confirmation
      setSubmittedData({
        salon: selectedSalon?.name || "",
        name: userDetails.name,
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        stylist: selectedStylist.name,
      });

      // Move to confirmed state
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
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
