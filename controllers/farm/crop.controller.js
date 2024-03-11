const Grid = require("../../models/grid/grid.model");
const {
    Crop,
    Cropvariety,
    Cropstage,
} = require("../../models/farm/crop.model");
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");
const { sequelize } = require("../../config/sequelize");
const { Op } = require("sequelize");

// ================================================================
// ===================== getCrops controller ======================
// ================================================================

exports.getCrops = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat) return frontError(res, "lat is required");
        if (!lon) return frontError(res, "lon is required");

        // ================================================================

        const data = await Grid.findOne({
            where: {
                bottom: { [Op.gt]: lat }, // bottom > lat
                top: { [Op.lt]: lat }, // top < lat
                left: { [Op.lt]: lon }, // left < lon
                right: { [Op.gt]: lon },
            },
            attributes: ["soiltype", "region", "updated_region"],
        });

        let region;
        const soiltype = data.soiltype;
        if (data.updated_region === "none") {
            region = data.region;
        } else {
            region = data.updated_region;
        }

        const crops = await Crop.findAll({
            include: {
                model: Cropvariety,
                required: true,
                where: { [soiltype]: true, irrigation_source: region },
                attributes: ["variety_eng"],
            },
            attributes: ["crop"],
        });
        const crops_data = JSON.parse(JSON.stringify(crops));

        let response = {};
        for (const crop of crops_data) {
            const crop_name = crop["crop"];
            console.log(
                "=============================asfasdfasdfsdf:",
                crop_name
            );
            response[crop_name] = [];

            for (const variety of crop["crop_varieties"]) {
                response[[crop_name]].push(variety["variety_eng"]);
            }
        }

        console.log(
            "++++++++++ crops ++++++++++++++\n",
            // JSON.stringify(crops[0], null, 2)
            response
        );
        console.log("=====================================================");

        successOk(res, response, true);
    } catch (error) {
        console.log("============== error ===============\n", error);
        console.log("=====================================================");
        catchError(res, error);
    }
};
