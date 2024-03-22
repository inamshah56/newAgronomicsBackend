const { returnPolygon } = require("../../utils/user/returnPolygon");
const { sequelize } = require("../../config/sequelize");
const { Crop, Cropvariety } = require("../../models/farm/crop.model");
const Grid = require("../../models/grid/grid.model");
const Farm = require("../../models/farm/farm.model");
const Lgs = require("../../models/farm/lgs.model");
const { Op, DATEONLY } = require("sequelize");
const { default: axios } = require("axios");
const pythonUrl = process.env.PYTHON_URL;
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");
const { types } = require("pg");

// ================================================================
// ===================== AlreadyCropSowed controller ==============
// ================================================================

exports.cropSowedFarm = async (req, res) => {
    try {
        console.log(
            "==================== API called sowedcrop ===================="
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
            crop,
            variety,
            sowdate,
        } = req.body;
        if (!size_acre) return frontError(res, "size_acre, this is required");
        if (size_acre > 240)
            return validationError(
                res,
                "size_acre, land size cannot be greater than 240 acre"
            );
        if (!land_name)
            return validationError(res, "land_name, this field is required");
        if (!tehsil) return frontError(res, "tehsil, this is required");
        if (!district) return frontError(res, "district, this is required");
        if (!province) return frontError(res, "province, this is required");
        if (!location) return frontError(res, "location, this is required");
        if (!geometry) return frontError(res, "geometry, this is required");
        if (!crop) return frontError(res, "crop, this is required");
        if (!variety) return frontError(res, "variety, this is required");
        if (!sowdate) return frontError(res, "sowdate, this is required");

        req.body["userUid"] = userUid;
        req.body["cultivated"] = true;
        req.body["sowdate_selected"] = true;
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
            attributes: [
                "id",
                "region",
                "updated_region",
                "soiltype",
                "elevation",
            ],
        });
        const gridId = grid.id;

        // creating lgs record:
        const lgs_record = {
            farmUid,
            gridId,
            cropCropName: crop,
            cropVarietyVarietyEng: variety,
            sowdate,
            sowed: true,
            userUid,
        };
        await Lgs.create(lgs_record);

        // Running the crop simulator
        let simulatorData = {
            uid: farmUid,
            gridId,
            sowdate,
            crop_name: crop,
            variety,
            soiltype: grid.soiltype,
            elevation: grid.elevation,
            lat,
            lon,
        };
        if (grid.updated_region === "none") {
            simulatorData["region"] = grid.region;
        } else {
            simulatorData["region"] = grid.updated_region;
        }

        response = await axios.post(`${pythonUrl}/sowedyes`, simulatorData);
        return successOk(res, "Farm Created successfully.", false);
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return validationError(
                res,
                "The select crop or variety in invalid."
            );
        }
        console.log(error.name);
        catchError(res, error);
    }
};

// ================================================================
// ===================== runLgsAgain controller ===================
// ================================================================

exports.runLgsAgain = async (req, res) => {
    try {
        const { uid } = req.query;
        const userUid = req.user.uid;
        const farmUid = uid;
        const lgsCheck = await Lgs.findOne({
            where: {
                farmUid: uid,
            },
            attributes: ["crops_lgs", "sowed", "gridId"],
        });

        //      ===================================

        if (lgsCheck && lgsCheck.crops_lgs) {
            return successOk(res, "Lgs Already created.");
        }
        if (lgsCheck && lgsCheck.sowed) {
            return successOk(res, "Crop Already Sowed.");
        }

        //      ===================================
        const farm = await Farm.findOne({
            where: { uid },
            attributes: ["location"],
        });
        if (!farm) {
            console.error(" ============ No farm exist. ============ \n");

            return validationError(res, "No farm exists");
        }
        // Finding the grid in which the farm fall.
        const lat = farm.location[1];
        const lon = farm.location[0];
        const grid = await Grid.findOne({
            where: {
                bottom: { [Op.gt]: lat }, // bottom > lat
                top: { [Op.lt]: lat }, // top < lat
                left: { [Op.lt]: lon }, // left < lon
                right: { [Op.gt]: lon },
            },
            attributes: ["id", "soiltype", "region", "updated_region"],
        });
        //      ===================================
        const gridId = grid.id;
        let region;
        if (grid.updated_region === "none") {
            region = grid.region;
        } else {
            region = grid.updated_region;
        }
        const soiltype = grid.soiltype;
        let lgs_record = {
            lat,
            lon,
            userUid,
            farmUid,
            gridId,
            soiltype,
            region,
        };

        // If farm lgs row does not created.
        if (!lgsCheck) {
            console.error(
                " ============ Lgs not created so creating. ============ \n"
            );

            await Lgs.create(lgs_record);
        }

        await axios.post(`${pythonUrl}/farmadded`, lgs_record);
        successOk(res, "lgs created successfully", false);
    } catch (error) {
        console.error(" ============ Error ============ \n", error);
        catchError(res, error);
    }
};

// ================================================================
// ===================== cropLgs controller =======================
// ================================================================

exports.cropLgs = async (req, res) => {
    try {
        const { uid } = req.query;
        const cropsLgs = await Lgs.findOne({
            where: {
                farmUid: uid,
            },
            attributes: ["crops_lgs"],
        });
        const response = cropsLgs.dataValues;
        response["crops_lgs"] = JSON.parse(response["crops_lgs"]);
        successOk(res, response["crops_lgs"], true);
    } catch (error) {
        console.error(" ============ Error ============ \n", error);
        catchError(res, error);
    }
};

// ================================================================
// ===================== sowdateSelected controller ===============
// ================================================================

exports.sowdateSelected = async (req, res) => {
    try {
        const { uid } = req.query;
        let { crop, variety, sowdate, sowing_method } = req.body;
        if (!crop) return validationError(res, "crop, this field is required.");
        if (!variety)
            return validationError(res, "variety, this field is required.");
        if (!sowdate)
            return validationError(res, "sowdate, this field is required.");
        if (!sowing_method)
            return validationError(
                res,
                "sowing_method, this field is required."
            );
        sowing_method = sowing_method.toLowerCase();

        // getting datesArray from crops_lgs to set variety_sowing_dates
        const lgs = await Lgs.findOne({
            where: {
                farmUid: uid,
            },
            attributes: ["crops_lgs"],
        });
        if (!lgs) {
            return frontError(res, "uid not valid.");
        }

        const cropLgs = JSON.parse(lgs.crops_lgs);
        const variety_sowing_dates = cropLgs[[crop]][[variety]];
        console.log(typeof variety_sowing_dates);
        const lgs_record = {
            cropCropName: crop.toLowerCase(),
            cropVarietyVarietyEng: variety.toLowerCase(),
            sowing_method,
            sowdate,
            variety_sowing_dates,
        };
        await Lgs.update(lgs_record, {
            where: {
                farmUid: uid,
            },
        });

        // sowdate is selected so setting sowdate_selected to true
        await Farm.update(
            { sowdate_selected: true },
            {
                where: {
                    uid,
                },
            }
        );

        successOk(res, "sowdate updated successfully", true);
    } catch (error) {
        console.error(" ============ Error ============ \n", error);
        catchError(res, error);
    }
};

// ================================================================
// ===================== changeSowdate controller =================
// ================================================================

exports.changeSowdate = async (req, res) => {
    try {
        const { uid } = req.query;
        const { sowdate } = req.body;
        if (!sowdate)
            return validationError(res, "sowdate, Please provide new sowdate.");
        await Lgs.update(
            { sowdate },
            {
                where: {
                    farmUid: uid,
                },
            }
        );
        successOk(res, "sowdate updated successfully", true);
    } catch (error) {
        console.error(" ============ Error ============ \n", error);
        catchError(res, error);
    }
};

// ================================================================
// ===================== cropSowed controller =====================
// ================================================================

exports.cropSowed = async (req, res) => {
    try {
        const { uid } = req.query;
        const { sowdate } = req.body;
        if (!sowdate)
            return frontError(res, "sowdate, Please provide sowdate.");
        const today = new Date();
        const sowdatedDate = new Date(sowdate);
        if (today < sowdatedDate) {
            return frontError(res, `You can sow on ${sowdate}`);
        }
        // Also add the check that crop is already sowed or not to not run the Lgs again and again.

        const alreadySowed = await Lgs.findOne({
            where: {
                sowed: true,
            },
        });
        if (alreadySowed) {
            return successOk(res, "Already Sowed", false);
        }
        const lgs = await Lgs.update(
            { sowed: true },
            {
                where: {
                    farmUid: uid,
                },
                returning: ["gridId", "crop_name", "variety"],
            }
        );

        await Farm.update(
            { cultivated: true },
            {
                where: {
                    uid: uid,
                },
            }
        );
        let simulatorData = lgs[1][0].dataValues;
        console.log("================= crop: ", simulatorData.crop_name);
        console.log("================= variety: ", simulatorData.variety);
        simulatorData["uid"] = uid;
        simulatorData["sowdate"] = sowdate;
        const grid = await Grid.findOne({
            where: { id: simulatorData.gridId },
            attributes: [
                "soiltype",
                "region",
                "updated_region",
                "lat",
                "lon",
                "elevation",
            ],
        });
        simulatorData["soiltype"] = grid.soiltype;
        simulatorData["lat"] = grid.lat;
        simulatorData["lon"] = grid.lon;
        simulatorData["elevation"] = grid.elevation;
        if (grid.updated_region === "none") {
            simulatorData["region"] = grid.region;
        } else {
            simulatorData["region"] = grid.updated_region;
        }

        // Running the crop simulator
        await axios.post(`${pythonUrl}/sowedyes`, simulatorData);
        successOk(res, "Congratulation on Sowing", false);
    } catch (error) {
        console.log(" ============ Error ============ \n", error);
        catchError(res, error);
    }
};

// ================================================================
// ===================== getLgsData controller ====================
// ================================================================

exports.getLgsData = async (req, res) => {
    try {
        const { uid } = req.query;
        const lgs = await Lgs.findOne({
            where: {
                farmUid: uid,
            },
            attributes: [
                "cropCropName",
                "cropVarietyVarietyEng",
                "sowdate",
                "variety_sowing_dates",
            ],
        });
        if (!lgs) {
            return frontError(res, "There is no lgs against this farm uid.");
        }
        successOk(res, lgs, true);
    } catch (error) {
        catchError(res, error);
    }
};

// ================================================================
// =====================  controller ====================
// ================================================================
