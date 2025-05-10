const axios = require("axios");

const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, amount, currency } = req.body;

  try {
    const response = await axios.post(
      "https://sandboxapi.fincra.com/checkout/payments",
      {
        amount,
        currency,
        customer: { name, email },
        redirectUrl: "http://localhost:5173/payment-success", // Update to production URL when live
      },
      {
        headers: {
          Authorization: `Bearer ${FINCRA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ paymentLink: response.data?.data?.link });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};
