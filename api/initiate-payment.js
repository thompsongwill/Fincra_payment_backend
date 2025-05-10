const axios = require("axios");

// Load .env only in local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, amount, currency } = req.body;

  if (!name || !email || !amount || !currency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await axios.post(
      "https://sandboxapi.fincra.com/checkout/payments",
      {
        amount,
        currency,
        customer: { name, email },
        redirectUrl: "http://localhost:5173/payment-success", // Replace with your frontend prod URL
      },
      {
        headers: {
          Authorization: `Bearer ${FINCRA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentLink = response.data?.data?.link;
    res.status(200).json({ paymentLink });
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};
