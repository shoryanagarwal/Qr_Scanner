const User = require("./user");
const FamilyMember = require("./familyMembers");
const DailyEntry = require("./dailyEntry");
const Admin = require("./Admin");

User.hasMany(FamilyMember, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

FamilyMember.belongsTo(User, {
    foreignKey: "userId"
});

User.hasMany(DailyEntry, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

DailyEntry.belongsTo(User, {
    foreignKey: "userId"
});

module.exports = {
    User,
    FamilyMember,
    DailyEntry,
    Admin
};