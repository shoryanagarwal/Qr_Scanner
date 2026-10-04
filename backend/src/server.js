const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require("./models");

const registrationRoutes = require("./routes/registrationRoutes");

const adminRoutes = require("./routes/adminPortal.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", registrationRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Garba Entry API is running"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        await sequelize.authenticate();

        res.json({
            success: true,
            message: "Server and database are working"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL connected successfully");

        await sequelize.sync();
        console.log("✅ Database tables synchronized");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Unable to start server:");
        console.error(error);
    }
}

startServer();