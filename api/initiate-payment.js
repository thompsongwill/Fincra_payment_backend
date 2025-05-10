const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY;

// Payment route
app.post("/api/initiate-payment", async (req, res) => {
  const { name, email, amount, currency } = req.body;

  try {
    const response = await axios.post(
      "https://sandboxapi.fincra.com/checkout/payments",
      {
        amount,
        currency,
        customer: {
          name,
          email,
        },
        redirectUrl: "http://localhost:5173/payment-success",
      },
      {
        headers: {
          Authorization: `Bearer ${FINCRA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ paymentLink: response.data?.data?.link });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Export the Express app wrapped in serverless
module.exports.handler = serverless(app);
