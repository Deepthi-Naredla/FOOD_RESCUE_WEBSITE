
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");

// Load environment variables
dotenv.config();

// MongoDB Atlas DNS fix
dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

// Create Express app
const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

// Increased limit for volunteer QR image upload
app.use(express.json({
    limit: "5mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "5mb"
}));

// ===============================
// IMPORT ROUTES
// ===============================

const authRoutes = require("./routes/auth");
const donationRoutes = require("./routes/donations");
const adminRoutes = require("./routes/admin");

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        message: "FoodRescue API is running"
    });
});

// ===============================
// MONGODB CONNECTION
// ===============================

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas connected");

        app.listen(PORT, () => {
            console.log(
                `FoodRescue server running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    });
