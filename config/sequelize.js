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

// const sequelizeAgro = new Sequelize(
//     "moinAgronomics",
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

// module.exports = { sequelize, sequelizeAgro };
module.exports = { sequelize };
