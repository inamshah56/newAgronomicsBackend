const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
// const { v4: uuidv4 } = require("uuid");

const Crop = sequelize.define(
    "crop",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        crop: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        crop_category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        season: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        crop_season: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING,
        },
        root_depth_max_m: {
            type: DataTypes.FLOAT,
        },
        seed_sowing_depth_m: {
            type: DataTypes.FLOAT,
        },
    },
    {
        schema: "crop",
    }
);

const Cropvariety = sequelize.define(
    "crop_variety",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        variety_eng: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        variety_urdu: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        variety_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        seed_weight_mg: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        germination_percentage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maturity_percentage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        irrigation_source: {
            type: DataTypes.ENUM("irrigated", "rainfed", "drought"),
            allowNull: false,
            defaultValue: "rainfed",
        },
        crop_min_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        crop_max_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cwr_min_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cwr_max_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        min_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        max_temp: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        mad_percentage: {
            type: DataTypes.FLOAT,
        },
        sand: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        loamy_sand: {
            type: DataTypes.BOOLEAN,
            allowNull: false,

            // defaultValue: false,
        },
        sandy_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        loam: {
            type: DataTypes.BOOLEAN,
            // defaultValue: false,
            allowNull: false,
        },
        silt_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        silt: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        silty_clay_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        silty_clay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        clay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        sandy_clay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        sandy_clay_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
        clay_loam: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            // defaultValue: false,
        },
    },
    {
        schema: "crop",
    }
);
const Cropstage = sequelize.define(
    "crop_stage",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        stage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sub_stage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bbch_scale: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        kc: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        start_gdd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        end_gdd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        schema: "crop",
        timestamps: false,
        // uniqueKeys: {
        //     unique_crop_variety_stage: {
        //         fields: ["cropVarietyUid", "stage"],
        //     },
        // },
    }
);

module.exports = { Crop, Cropvariety, Cropstage };

// ===================================================================
// ============================ relations ============================
// ===================================================================

Crop.Cropvariety = Crop.hasMany(Cropvariety);
Cropvariety.Crop = Cropvariety.belongsTo(Crop);

Cropvariety.Cropstage = Cropvariety.hasMany(Cropstage);
Cropstage.Cropvariety = Cropstage.belongsTo(Cropvariety);
