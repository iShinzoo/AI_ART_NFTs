const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const REPLICATE_API_KEY = "";

app.post("/generate-image", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      req.body,
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Something went wrong.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
