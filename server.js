// ================================================================
// ===================== imports ==================================
// ================================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ================================================================
// ===================== importing configs ========================
// ================================================================

const { sequelize, sequelize_grided_pak } = require("./config/sequelize");

// ================================================================
// ===================== middlewares ==============================
// ================================================================

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================================================
// ===================== entry route ==============================
// ================================================================

app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to Agronomics" });
});

// ================================================================
// ===================== importing routes =========================
// ================================================================

require("./routes/user/otp.routes")(app);
require("./routes/user/user.routes")(app);
require("./routes/farm/farm.routes")(app);
require("./routes/farm/python.routes")(app);
require("./routes/farm/crop.routes")(app);
require("./routes/farm/lgs.routes")(app);

// ================================================================
// ===================== port =====================================
// ================================================================

const PORT = 8090;

// ================================================================
// ===================== database connection ======================
// ================================================================

// sequelize
// .sync({ force: false })
Promise.all([
    sequelize.sync({ force: false }),
    // sequelize_grided_pak.sync({ force: false }), // Sync the models for the second database
])
    .then(() => {
        console.log(
            `==============================================================================`
        );
        console.log(
            "<<<<<<<<<<  database connection established successfully  >>>>>>>>>>"
        );
        console.log(
            "<<<<<<<<<<  models synchronized successfully with the database  >>>>>>>>>>"
        );

        // Start the server after syncing
        app.listen(PORT, () => {
            console.log(
                `<<<<<<<<<<  server is listening at http://localhost:${PORT}  >>>>>>>>>>`
            );
            console.log(
                `==============================================================================`
            );
        });
    })
    .catch((error) => {
        console.error(
            "<<<<<<<<<<  error connecting to the database or starting the server >>>>>>>>>> \n",
            error
        );
        console.log(
            `==============================================================================`
        );
    });
