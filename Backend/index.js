const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "safehaven-backend" });
});

app.get("/", (req, res) => {
  res.send("SafeHaven backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`SafeHaven backend running on http://localhost:${PORT}`);
});
