const { Sequelize } = require("sequelize");
const dbConfig = require("./db");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

// const sequelize_grided_pak = new Sequelize(
//     "gridedpak",
//     dbConfig.USER,
//     dbConfig.PASSWORD,
//     {
//         host: dbConfig.HOST,
//         dialect: dbConfig.dialect,
//         pool: {
//             max: dbConfig.pool.max,
//             min: dbConfig.pool.min,
//             acquire: dbConfig.pool.acquire,
//             idle: dbConfig.pool.idle,
//         },
//     }
// );

// module.exports = { sequelize, sequelize_grided_pak };
module.exports = { sequelize };
