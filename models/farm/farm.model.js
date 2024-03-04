const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { v4: uuidv4 } = require("uuid");

const Farm = sequelize.define(
    "farm",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        farm_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
        },
        size_acre: {
            type: DataTypes.FLOAT,
        },
        land_name: {
            type: DataTypes.STRING,
        },
        tehsil: {
            type: DataTypes.STRING,
        },
        district: {
            type: DataTypes.STRING,
        },
        province: {
            type: DataTypes.STRING,
        },
        road_access: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        electricity: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        tubewell: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        well: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        canal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        tw_pipe_diameter_in: {
            type: DataTypes.INTEGER,
        },
        tw_depth_ft: {
            type: DataTypes.INTEGER,
        },
        tw_motor_power_hp: {
            type: DataTypes.INTEGER,
        },
        simulator_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        estate: {
            type: DataTypes.ENUM("sell", "lease", "self_own"),
            allowNull: false,
            defaultValue: "self_own",
        },
        estate_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        estate_active_date: {
            type: DataTypes.DATEONLY,
        },
        location: {
            type: DataTypes.ARRAY(DataTypes.FLOAT),
            allowNull: true,
        },
        geom_text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        geom: {
            type: DataTypes.GEOMETRY,
            allowNull: true,
        },
        refered_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        refered_to: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        schema: "public",
    }
);

module.exports = Farm;

// ===================================================================
// ============================ relations ============================
// ===================================================================

const User = require("../user/user.model");

User.Farm = User.hasMany(Farm);
Farm.User = Farm.belongsTo(User);
