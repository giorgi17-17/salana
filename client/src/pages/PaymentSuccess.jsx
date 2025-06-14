import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fdf8",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            color: "#22c55e",
            marginBottom: "20px",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: "24px",
            color: "#1a1a1a",
            marginBottom: "12px",
            fontWeight: "600",
          }}
        >
          Payment Successful!
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            marginBottom: "24px",
            lineHeight: "1.5",
          }}
        >
          Your payment has been processed successfully.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#16a34a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#22c55e")}
        >
          Return to Home
        </button>

        <p
          style={{
            color: "#999",
            fontSize: "14px",
            marginTop: "16px",
          }}
        >
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
