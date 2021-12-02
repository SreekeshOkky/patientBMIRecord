'use strict'

const es = require('event-stream');

const { getDataStream, writeToFile, clearFile } = require('./util');
const { checkBMI } = require('./bmiUtils');
const outputFile = './output/updatedRecord.json';
let initialLine = true;

const updatePatientRecord = (record, bmiData) => {

    if (bmiData) {
        record.BMICategory = bmiData.label;
        record.HealthRisk = bmiData.risk;
    }
    if (initialLine) {
        initialLine = false;
        writeToFile(outputFile, `${JSON.stringify(record)}`);
    } else {
        writeToFile(outputFile, `,\r\n${JSON.stringify(record)}`);
    }
}

/**
 * 
 * @param {string} file 
 * @returns BMI category wise count for the patients
 */
const categorizePatient = async (file) => {

    const category = {};
    const stream = getDataStream(file);
    clearFile(outputFile);
    initialLine = true;
    if (stream) {
        writeToFile(outputFile, '[')
        stream
            .pipe(es.map(patientRecord => {
                const bmiDetail = checkBMI(patientRecord);
                const bmiType = bmiDetail && bmiDetail.label ? bmiDetail.label : 'error';
                category[bmiType] = category[bmiType] ? (category[bmiType] + 1) : 1;
                updatePatientRecord(patientRecord, bmiDetail);
            }))
        const fileStreamPromise = new Promise(resolve => stream.on('end', () => resolve()));
        await fileStreamPromise;
        writeToFile(outputFile, ']');
    }
    return category;
};

module.exports = {
    categorizePatient
}