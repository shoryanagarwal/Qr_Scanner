const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FamilyMember = sequelize.define(
    "FamilyMember",
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
        gender: {
    type: DataTypes.STRING,
    allowNull: false
},

    },
    {
        tableName: "family_members",
        timestamps: false
    }
);

module.exports = FamilyMember;