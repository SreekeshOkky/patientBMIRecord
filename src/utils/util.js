'use strict'

const fs = require('fs');

/**
 * 
 * @param {number} value 
 * @param {array<number>} range 
 * @returns {boolean} Check if the value is within the range provided
 */
const isInRange = (value, range) => {

    if (range.length == 2) {
        return value >= range[0] && value <= range[1];
    } else if (range.length == 1) {
        return value >= range[0]
    }
    return false;
};

/**
 * 
 * @param {string} file 
 * @returns readStream for the file in 'source' folder
 */
const getDataStream = function (file) {

    const fileName = `./source/${file}`;
    if (fs.existsSync(fileName)) {
        const JSONStream = require('JSONStream'),
            patientDataStream = fs.createReadStream(fileName, { encoding: 'utf8' }),
            jsonParser = JSONStream.parse('*');

        return patientDataStream.pipe(jsonParser);
    }
    console.log(`No such file '${fileName}'`)
    return undefined;
};

/**
 * Write string into file
 * @param {string} file 
 * @param {string}} data 
 */
const writeToFile = (file, data) => {

    try {
        fs.appendFileSync(file, data);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Remove file if it exists
 * @param {string} file 
 */
const clearFile = (file) => {

    if (fs.existsSync(file)) {
        fs.unlinkSync(file)
    }
}

module.exports = {
    getDataStream,
    isInRange,
    writeToFile,
    clearFile
}