const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const { Admin } = require("./models");

async function createAdmin() {
    try {

        await sequelize.authenticate();

        console.log("✅ Database connected");

        const username = "admin";
        const password = "garba@2026";

        const existingAdmin = await Admin.findOne({
            where: { username }
        });

        if (existingAdmin) {

            console.log("⚠️ Admin already exists");

            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        await Admin.create({
            username,
            passwordHash
        });

        console.log("✅ Admin created successfully");
        console.log("Username:", username);
        console.log("Password:", password);

        process.exit(0);

    } catch (error) {

        console.error("❌ Error creating admin:");
        console.error(error);

        process.exit(1);
    }
}

createAdmin();