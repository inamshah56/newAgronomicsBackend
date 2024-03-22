const Simulator = require("../../models/farm/simulator.model");
const Farm = require("../../models/farm/farm.model");
const Grid = require("../../models/grid/grid.model");
const Lgs = require("../../models/farm/lgs.model");
const { default: axios } = require("axios");
const pythonUrl = process.env.PYTHON_URL;
const {
    successOk,
    catchError,
    validationError,
    frontError,
} = require("../../utils/user/responses");
const {
    getEfficiencyAndWettedAreaOfIrrigation,
    getWaterPumpFlowRate,
    pumpRunningTimeForRequiredWater,
} = require("../../utils/user/irrigation");

// ================================================================
// ===================== getSimulator controller ==================
// ================================================================

exports.getSimulator = async (req, res) => {
    try {
        const { uid } = req.query;
        if (!uid) return frontError(res, "uid, this is required");
        const lgs = await Lgs.findOne({
            where: {
                farmUid: uid,
            },
            attributes: [
                "sowdate",
                "sowed",
                "cropCropName",
                "cropVarietyVarietyEng",
                "gridId",
            ],
        });
        if (!lgs) {
            return frontError(res, "uid not valid.");
        }

        const simulator = await Simulator.findOne({
            where: {
                farmUid: uid,
            },
            attributes: [
                "crop_age",
                "currentmainstage",
                "currentstage",
                "nextstage",
                "datenextstage",
            ],
        });
        let simulatorData = {};
        const sowed = lgs.sowed;

        // rerun simulator incase not run before
        if (!simulator) {
            if (!sowed) {
                return frontError(res, "no simulator on this farm uid");
            }
            const grid = await Grid.findOne({
                where: { id: lgs.gridId },
                attributes: [
                    "region",
                    "updated_region",
                    "soiltype",
                    "elevation",
                    "lat",
                    "lon",
                ],
            });
            simulatorData = {
                uid: uid,
                gridId: lgs.gridId,
                sowdate: lgs.sowdate,
                crop_name: lgs.cropCropName,
                variety: lgs.cropVarietyVarietyEng,
                soiltype: grid.soiltype,
                elevation: grid.elevation,
                lat: grid.lat,
                lon: grid.lon,
            };
            if (grid.updated_region === "none") {
                simulatorData["region"] = grid.region;
            } else {
                simulatorData["region"] = grid.updated_region;
            }
            await axios.post(`${pythonUrl}/sowedyes`, simulatorData);
            return successOk(
                res,
                "simulator data will be available soon ...",
                false
            );
        }
        return successOk(res, simulator, true);
    } catch (error) {
        console.log(error);
        catchError(res, error);
    }
};

// ================================================================
// ===================== tubewellExists controller ================
// ================================================================

exports.tubewellExists = async (req, res) => {
    try {
        const { uid } = req.query;
        if (!uid) return frontError(res, "uid, this is required");

        const farm = await Farm.findOne({
            where: {
                uid,
            },
            attributes: ["tubewell", "tw_pipe_diameter_in"],
        });

        if (!farm) return frontError(res, "invalid farm uid");
        const info = !farm.tw_pipe_diameter_in ? false : true;
        const tubewell = farm.tubewell;
        return successOk(res, { tubewell, info }, true);
    } catch (error) {
        catchError(res, error);
    }
};

// ================================================================
// ===================== tubewellMotorInfo controller =============
// ================================================================

exports.tubewellMotorInfo = async (req, res) => {
    try {
        const { uid } = req.query;
        if (!uid) return frontError(res, "uid, this is required");

        const { tw_pipe_diameter_in, tw_depth_ft, tw_motor_power_hp } =
            req.body;

        if (!tw_pipe_diameter_in)
            return frontError(res, "tw_pipe_diameter_in, this is required");
        if (!tw_depth_ft)
            return frontError(res, "tw_depth_ft, this is required");
        if (!tw_motor_power_hp)
            return frontError(res, "tw_motor_power_hp, this is required");

        await Farm.update(
            { tw_pipe_diameter_in, tw_depth_ft, tw_motor_power_hp },
            {
                where: {
                    uid,
                },
            }
        );

        return successOk(res, "Motor info updated successfully", false);
    } catch (error) {
        catchError(res, error);
    }
};

// ================================================================
// ================= irrigationSchedule controller ================
// ================================================================

exports.irrigationSchedule = async (req, res) => {
    try {
        const { uid, tubewell_info } = req.query;
        if (!uid) return frontError(res, "uid, this is required");
        if (!tubewell_info)
            return frontError(res, "tubewell_info, this boolen is required");

        const simulator = await Simulator.findOne({
            where: {
                farmUid: uid,
            },
            attributes: ["irrigationrequire_today", "nextwaterday"],
        });
        if (!simulator) return frontError(res, "no simulator on this farm uid");
        const response = {
            irrigationrequire_today: simulator.irrigationrequire_today,
            nextwaterday: simulator.nextwaterday,
        };
        // If tubewell info is true this means we also have to send the tubewell running time.
        if (tubewell_info) {
            const farm = await Farm.findOne({
                where: {
                    uid,
                },
                attributes: ["size_acre", "tw_depth_ft", "tw_motor_power_hp"],
            });
            const landSize = farm.size_acre;
            const hp = farm.tw_motor_power_hp;
            const pumpDepth = farm.tw_depth_ft;
            console.log("===== landSize ===== : ", landSize);
            console.log("===== hp ===== : ", hp);
            console.log("===== pumpDepth ===== : ", pumpDepth);
            const pumpRunningTime = pumpRunningTimeForRequiredWater(
                1,
                landSize,
                hp,
                pumpDepth
            );
            response["pumpRunningTime"] = pumpRunningTime;
        }
        return successOk(res, response, true);
    } catch (error) {
        catchError(res, error);
    }
};
