const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const plantAnalysis = sequelize.define(
    "image_processing_result",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        farm_id: {
            type: DataTypes.BIGINT,
        },
        crop: {
            type: DataTypes.STRING,
        },
        crop_variety: {
            type: DataTypes.STRING,
        },
        crop_age: {
            type: DataTypes.INTEGER,
        },
        crop_stage: {
            type: DataTypes.STRING,
        },
        img1: {
            type: DataTypes.TEXT,
        },
        img_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        average_prediction: {
            type: DataTypes.TEXT,
        },
        img2: {
            type: DataTypes.TEXT,
        },
        img3: {
            type: DataTypes.TEXT,
        },
        img4: {
            type: DataTypes.TEXT,
        },
        img5: {
            type: DataTypes.TEXT,
        },
        img1_result: {
            type: DataTypes.TEXT,
        },
        img2_result: {
            type: DataTypes.TEXT,
        },
        img3_result: {
            type: DataTypes.TEXT,
        },
        img4_result: {
            type: DataTypes.TEXT,
        },
        img5_result: {
            type: DataTypes.TEXT,
        },
        img_count: {
            type: DataTypes.INTEGER,
        },
        annotated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        img1_annotation: {
            type: DataTypes.STRING,
        },
        img2_annotation: {
            type: DataTypes.STRING,
        },
        img3_annotation: {
            type: DataTypes.STRING,
        },
        img4_annotation: {
            type: DataTypes.STRING,
        },
        img5_annotation: {
            type: DataTypes.STRING,
        },
    },
    {
        schema: "public",
        timestamps: false,
    }
);
module.exports = plantAnalysis;

// ===================================================================
// ============================ relations ============================
// ===================================================================
const Farm = require("./farm.model");

Farm.plantAnalysis = Farm.hasMany(plantAnalysis, { onDelete: "NO ACTION" });
plantAnalysis.Farm = plantAnalysis.belongsTo(Farm);
