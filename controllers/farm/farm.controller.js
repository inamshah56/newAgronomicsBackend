const { returnPolygon } = require("../../utils/user/returnPolygon");
const { sequelize } = require("../../config/sequelize");
const Farm = require("../../models/farm/farm.model");
const Grid = require("../../models/grid/grid.model");
const Lgs = require("../../models/farm/lgs.model");
const plantAnalysis = require("../../models/farm/plantAnalysis.model");
const pythonUrl = process.env.PYTHON_URL;
const { Op } = require("sequelize");
const axios = require("axios");
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");

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
        if (!size_acre)
            return validationError(res, "size_acre, this field is required.");
        if (size_acre > 240)
            return validationError(
                res,
                "size_acre, land size cannot be greater than 240 acre"
            );
        if (!land_name)
            return validationError(res, "land_name, this field is required.");
        if (!tehsil)
            return validationError(res, "tehsil, this field is required.");
        if (!district)
            return validationError(res, "district, this field is required.");
        if (!province)
            return validationError(res, "province, this field is required.");
        if (!location)
            return validationError(res, "location, this field is required.");
        if (!geometry)
            return validationError(res, "geometry, this field is required.");

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
            attributes: ["id", "soiltype", "region", "updated_region"],
        });

        const gridId = grid.id;
        req.body["farmUid"] = farmUid;
        req.body["gridId"] = gridId;
        const lgs = await Lgs.create(req.body);
        let region;
        if (grid.updated_region === "none") {
            region = grid.region;
        } else {
            region = grid.updated_region;
        }
        const soiltype = grid.soiltype;
        const dataObj = {
            lat,
            lon,
            gridId,
            soiltype,
            region,
            farmUid,
        };
        response = await axios.post(`${pythonUrl}/farmadded`, dataObj);
        successOk(res, "Farm created successfully", false);
    } catch (error) {
        console.log(error.response.data);
        catchError(res, error);
    }
};

// ================================================================
// ===================== deleteFarm controller ====================
// ================================================================

exports.deleteFarm = async (req, res) => {
    try {
        const { uid } = req.query;
        const deletedFarm = await Farm.destroy({ where: { uid } });
        if (deletedFarm === 1) {
            // Record successfully deleted
            successOk(res, "Record deleted successfully", false);
        } else {
            // No record found with the given UID
            successOk(res, "Record not found", false);
        }
    } catch (error) {
        console.error(
            " ============ Error deleting record ============ \n",
            error
        );
        catchError(res, error);
    }
};
