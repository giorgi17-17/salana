import { useNavigate } from "react-router-dom";

function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#fdf8f8",
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
            color: "#ef4444",
            marginBottom: "20px",
          }}
        >
          ✗
        </div>

        <h1
          style={{
            fontSize: "24px",
            color: "#1a1a1a",
            marginBottom: "12px",
            fontWeight: "600",
          }}
        >
          Payment Failed
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            marginBottom: "24px",
            lineHeight: "1.5",
          }}
        >
          Your payment could not be processed. Please try again.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4b5563")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFail;
