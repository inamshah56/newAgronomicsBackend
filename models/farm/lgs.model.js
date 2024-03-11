const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Lgs = sequelize.define(
    "lgs",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        crop: {
            type: DataTypes.STRING,
        },
        variety: {
            type: DataTypes.STRING,
        },
        variety_sowing_dates: {
            type: DataTypes.STRING,
        },
        crops_lgs: {
            type: DataTypes.TEXT,
        },
        sowdate: {
            type: DataTypes.DATEONLY,
            defaultValue: null,
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

User.Lgs = User.hasMany(Lgs);
Lgs.User = Lgs.belongsTo(User);

Farm.Lgs = Farm.hasOne(Lgs);
Lgs.Farm = Lgs.belongsTo(Farm);

Grid.Lgs = Grid.hasMany(Lgs);
Lgs.Grid = Lgs.belongsTo(Grid);
