const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Simulator = sequelize.define(
    "simulator",
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
        crop_age: {
            type: DataTypes.BIGINT,
        },
        currentmainstage: {
            type: DataTypes.STRING,
        },
        currentstage: {
            type: DataTypes.STRING,
        },
        irrigationrequire_today: {
            type: DataTypes.BOOLEAN,
        },
        rainfalltoday: {
            type: DataTypes.BIGINT,
        },
        nextstage: {
            type: DataTypes.TEXT,
        },
        datenextstage: {
            type: DataTypes.TEXT,
        },
        expectedrainfall: {
            type: DataTypes.FLOAT,
        },
        nextwaterday: {
            type: DataTypes.TEXT,
        },
        datecreated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        amino: {
            type: DataTypes.INTEGER,
        },
        amino_count: {
            type: DataTypes.INTEGER,
        },
        last_amino_date: {
            type: DataTypes.DATE,
        },
    },
    {
        schema: "public",
        timestamps: false,
    }
);

module.exports = Simulator;

// ===================================================================
// ============================ relations ============================
// ===================================================================

const Farm = require("../farm/farm.model");
const Grid = require("../grid/grid.model");

Farm.Simulator = Farm.hasOne(Simulator);
Simulator.Farm = Simulator.belongsTo(Farm);

Grid.Simulator = Grid.hasOne(Simulator);
Simulator.Grid = Simulator.belongsTo(Grid);
