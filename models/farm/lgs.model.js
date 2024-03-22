const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Lgs = sequelize.define(
    "lgs",
    {
        farmUid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "farms",
                key: "uid",
            },
        },
        variety_sowing_dates: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        crops_lgs: {
            type: DataTypes.TEXT,
        },
        sowdate: {
            type: DataTypes.DATEONLY,
            defaultValue: null,
        },
        sowing_method: {
            type: DataTypes.ENUM(
                "drill sowing",
                "broadcasting method",
                "pora method",
                "none"
            ),
            defaultValue: "none",
        },
        sowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        harvested: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        soil_condition: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        schema: "public",
        timestamps: false,
    }
);

module.exports = Lgs;

// ===================================================================
// ============================ relations ============================
// ===================================================================
const User = require("../user/user.model");
const Farm = require("../farm/farm.model");
const Grid = require("../grid/grid.model");
const { Crop, Cropvariety } = require("./crop.model");

User.Lgs = User.hasMany(Lgs);
Lgs.User = Lgs.belongsTo(User);

Farm.Lgs = Farm.hasOne(Lgs);
Lgs.Farm = Lgs.belongsTo(Farm);

Grid.Lgs = Grid.hasMany(Lgs, { onDelete: "Set NULL" });
Lgs.Grid = Lgs.belongsTo(Grid);

Crop.Lgs = Crop.hasMany(Lgs, { onDelete: "SET NULL" });
Lgs.Crop = Lgs.belongsTo(Crop);

Cropvariety.Lgs = Cropvariety.hasMany(Lgs, {
    onDelete: "SET NULL",
});
Lgs.Cropvariety = Lgs.belongsTo(Cropvariety);
