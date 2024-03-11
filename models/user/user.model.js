const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { v4: uuidv4 } = require("uuid");

const User = sequelize.define(
    "user",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        profile_pic: {
            type: DataTypes.STRING,
        },
        full_name: {
            type: DataTypes.STRING,
        },
        cnic: {
            type: DataTypes.STRING,
        },
        cnic_front: {
            type: DataTypes.STRING,
        },
        cnic_back: {
            type: DataTypes.STRING,
        },
        trial_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        trial_active_date: {
            type: DataTypes.DATEONLY,
        },
        company: {
            type: DataTypes.STRING,
        },
        ntn: {
            type: DataTypes.STRING,
        },
    },
    {
        schema: "public",
    }
);

module.exports = User;
