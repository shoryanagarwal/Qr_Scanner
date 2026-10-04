const express = require("express");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

const { User, FamilyMember } = require("../models");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, age, gender, phone, familyMembers } = req.body;
        // Basic validation
        if (!name || !age || !gender || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, age and phone are required"
            });
        }

        // Check if phone already registered
        const existingUser = await User.findOne({
            where: { phone }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This phone number is already registered"
            });
        }

        // Generate unique QR token
        const qrToken = uuidv4();

        // Create user
       const user = await User.create({
    name,
    age,
    gender,
    phone,
    qrToken
});

        // Add family members
        if (Array.isArray(familyMembers)) {
            for (const member of familyMembers) {
                if (member.name && member.age && member.gender) {
                    await FamilyMember.create({
                        userId: user.id,
                        name: member.name,
                        age: member.age,
                        gender: member.gender
                    });
                }
            }
        }

        const qrCode = await QRCode.toDataURL(qrToken);

            res.status(201).json({
                success: true,
                message: "Registration successful",
                data: {
                    userId: user.id,
                    name: user.name,
                    age: user.age,
                    phone: user.phone,
                    qrToken: user.qrToken,
                    qrCode: qrCode
                }
            });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

module.exports = router;