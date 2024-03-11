const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Grid = sequelize.define(
    "grid",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        lon: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        left: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        right: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        top: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        bottom: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        elevation: {
            type: DataTypes.INTEGER,
        },
        nearest_points: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
        },
        point_count: {
            type: DataTypes.BIGINT,
        },
        division: {
            type: DataTypes.STRING,
        },
        soiltype: {
            type: DataTypes.STRING,
        },
        region: {
            type: DataTypes.ENUM("irrigated", "rainfed", "drought", "none"),
        },
        updated_region: {
            type: DataTypes.STRING,
        },
        precipitation_zone: {
            type: DataTypes.STRING,
        },
        agriable: {
            type: DataTypes.ENUM("yes", "no"),
        },
        uc: {
            type: DataTypes.STRING,
        },
        tehsil: {
            type: DataTypes.STRING,
        },
        province: {
            type: DataTypes.STRING,
        },
    },
    {
        schema: "public",
        timestamps: false,
    }
);

module.exports = Grid;
