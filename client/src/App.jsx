import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Services from "./components/home/Services";
// import Professionals from "./pages/Professionals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Booking from "./pages/Booking";
import SalonListing from "./pages/SalonListing";
import SalonDetail from "./pages/SalonDetail";
import BusinessLogin from "./pages/BusinessLogin";
import BusinessRegister from "./pages/BusinessRegister";
import "./styles/globals.css";
import "./styles/pages/Booking.css";
import "./styles/pages/Pricing.module.css";
import "./styles/components/booking/StepComponents.module.css";
import "./styles/components/booking/BookingProgress.module.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            {/* <Route path="/professionals" element={<Professionals />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/salons" element={<SalonListing />} />
            <Route path="/salon/:salonId" element={<SalonDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/:salonId" element={<Booking />} />
            <Route path="/business/login" element={<BusinessLogin />} />
            <Route path="/business/register" element={<BusinessRegister />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
