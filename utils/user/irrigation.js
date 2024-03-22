// This module calculates the amount of water required and pump running time based on irrigation type

// Function to get efficiency and wetted area of irrigation
function getEfficiencyAndWettedAreaOfIrrigation(irrigationType) {
    // The given efficiency and wetted area are in percentage
    if (irrigationType === "surface") {
        return [50, 50];
    } else if (irrigationType === "drip") {
        return [90, 5];
    } else if (irrigationType === "sprinkler") {
        return [75, 60];
    } else {
        return [0, 0];
    }
}

// Function to get water pump flow rate
function getWaterPumpFlowRate(hp, pumpDepth) {
    const gravity = 1;
    const efficiency = 0.65; // Assuming pump efficiency as 65%
    const density = 1000;
    const power = hp * 735.499; // 1 hp = 0.735499 kW
    const flowRate = (power * efficiency) / (density * gravity * pumpDepth);
    const flowRateGallonsPerMin = flowRate * 264.172 * 60; // 1 m3 = 264.172 gallons, convert to gallons per minute
    return flowRateGallonsPerMin;
}

// Function to calculate pump running time for required water
function pumpRunningTimeForRequiredWater(
    requiredWaterMm,
    landSize,
    hp,
    pumpDepth,
    irrigationType = "surface"
) {
    const [efficiency, wettedArea] =
        getEfficiencyAndWettedAreaOfIrrigation(irrigationType);
    const waterGallons = (requiredWaterMm / 25.4) * 12;
    const gallonsOverArea = waterGallons * landSize * 43560 * 7.48;
    const gallonsOverAreaWithEfficiencyNwettedArea =
        (gallonsOverArea / (efficiency / 100)) * (wettedArea / 100);
    const flowRate = getWaterPumpFlowRate(hp, pumpDepth);
    const pumpTime = gallonsOverAreaWithEfficiencyNwettedArea / flowRate;
    return pumpTime;
}

// Export the functions to be used in other modules
module.exports = {
    getEfficiencyAndWettedAreaOfIrrigation,
    getWaterPumpFlowRate,
    pumpRunningTimeForRequiredWater,
};
