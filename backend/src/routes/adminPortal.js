const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    Admin,
    User,
    FamilyMember,
    DailyEntry
} = require("../models");

const router = express.Router();


// ========================================
// GET GARBA DAY
// 5:00 AM -> next day 4:59 AM
// ========================================

function getGarbaDay() {
    const now = new Date();

    // Convert current time to IST
    const istString = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });

    const istDate = new Date(istString);

    // Before 5 AM belongs to previous Garba day
    if (istDate.getHours() < 5) {
        istDate.setDate(istDate.getDate() - 1);
    }

    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, "0");
    const day = String(istDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ========================================
// ADMIN LOGIN
// ========================================

router.post("/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const admin = await Admin.findOne({
            where: { username }
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                adminId: admin.id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Admin login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});


// ========================================
// SCAN QR
// ========================================

router.post("/admin/scan", async (req, res) => {
    try {
        const { qrToken } = req.body;

        if (!qrToken) {
            return res.status(400).json({
                success: false,
                message: "QR token is required"
            });
        }

        // Find registered user
        const user = await User.findOne({
            where: {
                qrToken
            },
            include: [
                {
                    model: FamilyMember
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid QR code"
            });
        }


        // ========================================
        // GET CURRENT GARBA DAY
        // ========================================

        const garbaDay = getGarbaDay();


        // ========================================
        // COUNT PEOPLE
        // Main registrant + family members
        // ========================================

        const familyCount = user.FamilyMembers
            ? user.FamilyMembers.length
            : 0;

        const attendeeCount = 1 + familyCount;


        // ========================================
        // CHECK WHETHER QR ALREADY USED
        // DURING CURRENT GARBA DAY
        // ========================================

        const existingEntry = await DailyEntry.findOne({
            where: {
                userId: user.id,
                entryDate: garbaDay
            }
        });


        // ========================================
        // ALREADY ENTERED
        // ========================================

        if (existingEntry) {
            return res.status(400).json({
                success: false,
                alreadyEntered: true,

                message:
                    "This QR code has already been used for today's Garba.",

                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        age: user.age,
                        gender: user.gender,
                        phone: user.phone
                    },

                    familyMembers:
                        user.FamilyMembers || [],

                    attendeeCount:
                        existingEntry.attendeeCount,

                    entryDate:
                        existingEntry.entryDate,

                    enteredAt:
                        existingEntry.enteredAt
                }
            });
        }


        // ========================================
        // CREATE ENTRY
        // ========================================

       const dailyEntry = await DailyEntry.create({
    userId: user.id,
    name: user.name,
    phone: user.phone,
    entryDate: garbaDay,
    attendeeCount: attendeeCount,
    enteredAt: new Date()
});


        // ========================================
        // ENTRY ALLOWED
        // ========================================

        res.json({
            success: true,
            alreadyEntered: false,

            message: "Entry allowed",

            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    age: user.age,
                    gender: user.gender,
                    phone: user.phone
                },

                familyMembers:
                    user.FamilyMembers || [],

                attendeeCount:
                    dailyEntry.attendeeCount,

                entryDate:
                    dailyEntry.entryDate,

                enteredAt:
                    dailyEntry.enteredAt
            }
        });

    } catch (error) {
        console.error("QR scan error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to process QR code"
        });
    }
});



// ========================================
// GET TODAY'S ATTENDANCE
// ========================================

router.get("/admin/attendance", async (req, res) => {
    try {
        const garbaDay = getGarbaDay();

        const entries = await DailyEntry.findAll({
            where: {
                entryDate: garbaDay
            },
            order: [
                ["enteredAt", "DESC"]
            ]
        });

        const totalPeople = entries.reduce(
            (total, entry) => total + entry.attendeeCount,
            0
        );

        res.json({
            success: true,

            data: {
                entryDate: garbaDay,
                totalRegistrations: entries.length,
                totalPeople: totalPeople,
                entries: entries
            }
        });

    } catch (error) {
        console.error("Attendance fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch attendance"
        });
    }
});



// ========================================
// GET ATTENDANCE HISTORY
// ========================================

router.get("/admin/attendance/history", async (req, res) => {
    try {
        const entries = await DailyEntry.findAll({
            order: [
                ["entryDate", "DESC"],
                ["enteredAt", "DESC"]
            ]
        });

        // Group entries by Garba day
        const historyMap = {};

        entries.forEach((entry) => {
            const date = entry.entryDate;

            if (!historyMap[date]) {
                historyMap[date] = {
                    entryDate: date,
                    totalEntries: 0,
                    totalPeople: 0
                };
            }

            historyMap[date].totalEntries += 1;
            historyMap[date].totalPeople +=
                entry.attendeeCount;
        });

        const history = Object.values(historyMap);

        res.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error(
            "Attendance history error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch attendance history"
        });
    }
});

// ========================================
// GET ATTENDANCE DETAILS FOR A DATE
// ========================================

router.get("/admin/attendance/history/:date", async (req, res) => {
    try {
        const { date } = req.params;

        const entries = await DailyEntry.findAll({
            where: {
                entryDate: date
            },
            order: [
                ["enteredAt", "DESC"]
            ]
        });

        const totalPeople = entries.reduce(
            (total, entry) => total + entry.attendeeCount,
            0
        );

        res.json({
            success: true,
            data: {
                entryDate: date,
                totalEntries: entries.length,
                totalPeople: totalPeople,
                entries: entries
            }
        });

    } catch (error) {
        console.error(
            "Attendance details error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch attendance details"
        });
    }
});

module.exports = router;