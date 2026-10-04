const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 120
            }
        },

        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },

        qrToken: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        gender: {
    type: DataTypes.STRING,
    allowNull: false
},
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    },
    
);

module.exports = User;