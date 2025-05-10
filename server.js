require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const FINCRA_SECRET_KEY = "UrmQ7BB1ebVp7WiM7rRrWv8ddjZ1R4GE"; // Replace this with your real Fincra secret key

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

app.listen(8000, () =>
  console.log("✅ Backend running on http://localhost:8000")
);
