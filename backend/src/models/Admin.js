const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define(
    "Admin",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "admins",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

module.exports = Admin;