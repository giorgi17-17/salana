import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

const AUTH_URL =
  "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const API_BASE = "https://api.bog.ge/payments/v1/ecommerce";

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 60000) {
    return cachedToken;
  }

  const creds = Buffer.from(
    `${process.env.BOG_PUBLIC_KEY}:${process.env.BOG_SECRET_KEY}`
  ).toString("base64");
  const resp = await axios.post(AUTH_URL, "grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  cachedToken = resp.data.access_token;
  tokenExpiry = now + resp.data.expires_in * 1000;
  return cachedToken;
}

app.post("/api/create-order", async (req, res) => {
  try {
    const {
      amount,
      productId,
      externalOrderId,
      successUrl,
      failUrl,
      callbackUrl,
      userId,
      isSubscription,
    } = req.body;

    const token = await getAccessToken();

    const orderResponse = await axios.post(
      `${API_BASE}/orders`,
      {
        callback_url:
          callbackUrl ||
          "https://4285-2a0b-6204-92cc-2300-7dce-5b52-567c-7e00.ngrok-free.app/api/payment-callback",
        external_order_id: externalOrderId || uuidv4(),
        purchase_units: {
          currency: "GEL",
          total_amount: amount || 1,
          basket: [
            {
              product_id: productId || "product_001",
              quantity: 1,
              unit_price: amount || 1,
            },
          ],
        },
        redirect_urls: {
          success: successUrl || "http://localhost:5173/payment-success",
          fail: failUrl || "http://localhost:5173/payment-fail",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Idempotency-Key": uuidv4(),
          "Accept-Language": "en",
        },
      }
    );

    const { id: orderId, _links } = orderResponse.data;

    // Save card for subscriptions if needed
    if (isSubscription && userId) {
      try {
        // Try to save card for subscriptions
        await axios.put(`${API_BASE}/orders/${orderId}/subscriptions`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": uuidv4(),
          },
        });
        console.log("✅ Card saved for subscriptions");
      } catch (subscriptionError) {
        console.log(
          "⚠️ Subscription endpoint failed, but continuing with manual subscription:",
          subscriptionError.response?.data?.message || subscriptionError.message
        );
      }

      // Store subscription data regardless of BOG subscription call
      const subscriptions = JSON.parse(
        fs.readFileSync("subscriptions.json", "utf8")
      );
      const newSubscription = {
        id: uuidv4(),
        userId,
        orderId,
        amount,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      subscriptions.push(newSubscription);
      fs.writeFileSync(
        "subscriptions.json",
        JSON.stringify(subscriptions, null, 2)
      );
      console.log("🔄 Subscription created:", newSubscription);
    }

    res.json({
      orderId,
      redirectUrl: _links.redirect.href,
    });
  } catch (e) {
    console.error("ERROR:", e.response?.data || e.message);
    res
      .status(500)
      .json({ error: "Create order failed", details: e.response?.data });
  }
});

// Add callback endpoint
app.post("/api/payment-callback", async (req, res) => {
  try {
    console.log("BOG Callback received:", JSON.stringify(req.body, null, 2));

    // BOG sends callback in this format: { event: "order_payment", body: { order_id, order_status: { key: "completed" } } }
    if (req.body.event === "order_payment" && req.body.body) {
      const { order_id, order_status } = req.body.body;

      if (order_id && order_status?.key === "completed") {
        const subscriptions = JSON.parse(
          fs.readFileSync("subscriptions.json", "utf8")
        );
        const index = subscriptions.findIndex((s) => s.orderId === order_id);

        if (index !== -1) {
          subscriptions[index].status = "active";
          subscriptions[index].nextPayment = new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000
          ).toISOString(); // Next payment in 1 day
          fs.writeFileSync(
            "subscriptions.json",
            JSON.stringify(subscriptions, null, 2)
          );
          console.log("✅ Subscription activated:", subscriptions[index]);
        }
      }
    }

    res.status(200).json({ status: "received" });
  } catch (e) {
    console.error("Callback error:", e);
    res.status(500).json({ error: "Callback failed" });
  }
});

// Check payment status endpoint
app.get("/api/payment-status/:orderId", async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${API_BASE}/receipt/${req.params.orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (e) {
    console.error("Get payment status error:", e.response?.data || e.message);
    res.status(500).json({ error: "Failed to get payment status" });
  }
});

// Get all subscriptions
app.get("/api/subscriptions", (req, res) => {
  try {
    const subscriptions = JSON.parse(
      fs.readFileSync("subscriptions.json", "utf8")
    );
    res.json(subscriptions);
  } catch (e) {
    res.json([]);
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
