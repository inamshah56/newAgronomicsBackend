const Farm = require("../../models/farm/farm.model");
const Lgs = require("../../models/farm/lgs.model");
const Grid = require("../../models/grid/grid.model");
const pythonUrl = process.env.PYTHON_URL;
const { Op } = require("sequelize");
const axios = require("axios");

const { returnPolygon } = require("../../utils/user/returnPolygon");
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");
const { sequelize } = require("../../config/sequelize");

// ================================================================
// ===================== getFarm controller =======================
// ================================================================

exports.getFarm = async (req, res) => {
    try {
        const userUid = req.user.uid;
        const userFarms = await Farm.findAll({
            attributes: {
                exclude: [
                    "geometry",
                    "geom",
                    "createdAt",
                    "updateAt",
                    "userUid",
                ],
            },
            where: { userUid },
        });
        successOk(res, userFarms, true);
    } catch (error) {
        catchError(res, error);
    }
};

// ================================================================
// ===================== postFarm controller ======================
// ================================================================

exports.createFarm = async (req, res) => {
    try {
        console.log(
            "==================== API called createfarm ===================="
        );
        const userUid = req.user.uid;
        const {
            size_acre,
            land_name,
            tehsil,
            district,
            province,
            road_access,
            electricity,
            tubewell,
            well,
            canal,
            location,
            geometry,
        } = req.body;
        if (!size_acre) return validationError(res, "this field is required.");
        if (!land_name) return validationError(res, "this field is required.");
        if (!tehsil) return validationError(res, "this field is required.");
        if (!district) return validationError(res, "this field is required.");
        if (!province) return validationError(res, "this field is required.");
        if (!location) return validationError(res, "this field is required.");
        if (!geometry) return validationError(res, "this field is required.");

        req.body["userUid"] = userUid;
        const farmResponse = await Farm.create(req.body);

        const farmUid = farmResponse.uid;
        const geom_text = returnPolygon(geometry);
        await sequelize.query(
            `UPDATE farms SET geom_text = '${geom_text}', geom = ST_GeomFromText('${geom_text}') WHERE uid = '${farmUid}'`
        );

        // Finding the grid in which the farm fall.
        const lat = location[1];
        const lon = location[0];

        const grid = await Grid.findOne({
            where: {
                bottom: { [Op.gt]: lat }, // bottom > lat
                top: { [Op.lt]: lat }, // top < lat
                left: { [Op.lt]: lon }, // left < lon
                right: { [Op.gt]: lon },
            },
            attributes: ["id", "soiltype", "updated_region"],
        });

        const gridId = grid.id;
        req.body["farmUid"] = farmUid;
        req.body["gridId"] = gridId;
        req.body["cultivated"] = true;

        const lgs = await Lgs.create(req.body);

        let region;
        if (grid.updated_region === "none") {
            region = grid.region;
        } else {
            region = grid.updated_region;
        }
        const soiltype = grid.soiltype;
        const lgsUid = lgs.uid;
        const dataObj = {
            lat,
            lon,
            gridId,
            soiltype,
            region,
            lgsUid,
        };

        const response = await axios.post(`${pythonUrl}/farmadded`, dataObj);
        successOk(res, "Farm created successfully", false);
    } catch (error) {
        catchError(res, error);
    }
};
