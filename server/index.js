import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
    if (isSubscription) {
      try {
        await axios.put(`${API_BASE}/orders/${orderId}/subscriptions`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": uuidv4(),
          },
        });
        console.log("✅ Card saved for subscriptions");
      } catch (subscriptionError) {
        console.log(
          "⚠️ Subscription endpoint failed, but continuing:",
          subscriptionError.response?.data?.message || subscriptionError.message
        );
      }
    }

    // Store payment data in Supabase for all payments
    if (userId) {
      const { data: payment, error } = await supabase
        .from("payments")
        .insert({
          business_id: userId, // This is now the business_id from frontend
          amount,
          transaction_id: orderId,
          status: "pending",
          payment_method: "credit_card",
          payment_processor: "bog",
          description: isSubscription
            ? "Subscription payment"
            : "One-time payment",
          metadata: { isSubscription, external_order_id: externalOrderId },
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Failed to create payment record:", error);
      } else {
        console.log("🔄 Payment created:", payment);
      }
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
        // Update payment status in Supabase
        const { data: payment, error } = await supabase
          .from("payments")
          .update({
            status: "completed",
            processed_at: new Date().toISOString(),
          })
          .eq("transaction_id", order_id)
          .select()
          .single();

        if (error) {
          console.error("❌ Failed to update payment:", error);
        } else {
          console.log("✅ Payment completed:", payment);
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

// Get all payments
app.get("/api/payments", async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Failed to fetch payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    } else {
      res.json(payments);
    }
  } catch (e) {
    console.error("Error fetching payments:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Process recurring subscriptions cron job
setInterval(async () => {
  try {
    console.log("⏰ Processing subscription renewals...");

    // Find active subscriptions that need renewal (older than 30 days)
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: subscriptions, error } = await supabase
      .from("payments")
      .select("*, businesses(user_id)")
      .eq("status", "completed")
      .eq("metadata->isSubscription", true)
      .lt("created_at", thirtyDaysAgo);

    if (error) {
      console.error("❌ Failed to fetch subscriptions:", error);
      return;
    }

    console.log(
      `📊 Found ${subscriptions?.length || 0} subscriptions due for renewal`
    );

    for (const subscription of subscriptions || []) {
      // Create renewal payment record
      const { data: renewal, error: renewalError } = await supabase
        .from("payments")
        .insert({
          business_id: subscription.business_id,
          amount: subscription.amount,
          status: "pending",
          payment_method: "credit_card",
          payment_processor: "bog",
          description: "Subscription renewal",
          metadata: {
            isSubscription: true,
            parentPaymentId: subscription.id,
            renewalDate: new Date().toISOString(),
          },
        });

      if (renewalError) {
        console.error(
          `❌ Failed to create renewal for ${subscription.id}:`,
          renewalError
        );
      } else {
        console.log(
          `✅ Created renewal payment for business ${subscription.business_id}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Subscription renewal cron failed:", error);
  }
}, 24 * 60 * 60 * 1000); // Daily

// Keep Render service alive
setInterval(async () => {
  try {
    await axios.get(process.env.RENDER_URL);
    console.log("⏰ Keep-alive ping sent");
  } catch (error) {
    console.error("Keep-alive failed:", error.message);
  }
}, 14 * 60 * 1000); // Every 14 minutes

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
