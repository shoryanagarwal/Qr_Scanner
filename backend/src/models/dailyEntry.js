const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DailyEntry = sequelize.define(
    "DailyEntry",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },

        // Garba day: 5:00 AM -> next day 4:59 AM
        entryDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        // Total people represented by this QR
        attendeeCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        enteredAt: {
            type: DataTypes.DATE,
            allowNull: true
        },

        name: {
    type: DataTypes.STRING,
    allowNull: false
},

phone: {
    type: DataTypes.STRING,
    allowNull: false
},
    },
    {
        tableName: "daily_entries",
        timestamps: true,

        indexes: [
            {
                name: "daily_entries_user_date_unique",
                unique: true,
                fields: ["userId", "entryDate"]
            }
        ]
    }
);

module.exports = DailyEntry;