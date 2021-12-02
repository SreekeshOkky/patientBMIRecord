'use strict'

const es = require('event-stream');

const { getDataStream, writeToFile, clearFile } = require('./util');
const { getPatientBMIDetails } = require('./bmiUtils');
const outputFile = './output/updatedRecord.json';

let initialLine = true;
let category = {};

/**
 * 
 * @param {object} record 
 * @param {object} bmiData 
 * @returns Updated patient record with BMI data
 */
const updatePatientRecord = (record, bmiData) => {

    if (bmiData) {
        record.BMICategory = bmiData.label;
        record.HealthRisk = bmiData.risk;
    }
    return record;
}

/**
 * Stream the patient records, process the patient and save the updated records and store patient / category count
 * @param {string} file 
 * @returns BMI category wise count for the patients
 */
const categorizePatient = async (file) => {

    const stream = getDataStream(file);
    resetAll();
    if (stream) {
        writeToFile(outputFile, '[')
        stream
            .pipe(es.map(patientRecord => {
                processPatientrecord(patientRecord);
            }));
        stream.on('error', function (err) {
            console.log(err);
        });
        const fileStreamPromise = new Promise(resolve => stream.on('end', () => resolve()));
        await fileStreamPromise;
        writeToFile(outputFile, ']');
    }
    return category;
};

/**
 * Reset category, output file and initialLine flag
 */
const resetAll = () => {

    clearFile(outputFile);
    category = {};
    initialLine = true;
}

/**
 * Process the given record and write updated record to output file
 * @param {object} patientRecord 
 * @param {boolean} write 
 */
const processPatientrecord = (patientRecord, write = true) => {

    const bmiDetail = getPatientBMIDetails(patientRecord);
    const bmiType = bmiDetail && bmiDetail.label ? bmiDetail.label : 'error';
    category[bmiType] = category[bmiType] ? (category[bmiType] + 1) : 1;
    patientRecord = updatePatientRecord(patientRecord, bmiDetail);
    if (write) {
        writeOutputFile(patientRecord);
    }
    return patientRecord;
}

/**
 * Write patient record to output file
 * @param {object} record 
 */
const writeOutputFile = (record) => {

    if (initialLine) {
        initialLine = false;
        writeToFile(outputFile, `${JSON.stringify(record)}`);
    } else {
        writeToFile(outputFile, `,\r\n${JSON.stringify(record)}`);
    }
}

module.exports = {
    categorizePatient,
    processPatientrecord
}