function returnPolygon(latlngList) {
    const newList = [];
    latlngList.forEach((listt) => {
        if (listt) {
            const newString = `${listt[0]} ${listt[1]}`;
            newList.push(newString);
        }
    });
    const closingString = newList[0];
    newList.push(closingString);
    const poly = newList.join(",");
    const string = `POLYGON((${poly}))`;
    return string;
}

module.exports = { returnPolygon };
