'use strict'

const es = require('event-stream'),
    fs = require('fs');

const calculateBMI = (heightCm, weightKg) => {

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * 2);
    return bmi;
};

const getBMIdetail = (bmi) => {

    const bmiMapping = require('../constants/bmi.json');
    return bmiMapping.filter(category => isInRange(bmi, category.range));
};

const isInRange = (value, range) => {

    if (range.length == 2) {
        return value >= range[0] && value <= range[1];
    } else if (range.length == 1) {
        return value >= range[0]
    }
    return false;
};

const checkBMI = (patient) => {

    const bmi = calculateBMI(patient.HeightCm, patient.WeightKg);
    const bmiDetail = getBMIdetail(bmi);

    return bmiDetail[0];
};

const getDataStream = function () {
    const JSONStream = require('JSONStream');
    var patientData = './constants/patients.json',
        patientDataStream = fs.createReadStream(patientData, { encoding: 'utf8' }),
        jsonParser = JSONStream.parse('*');

    return patientDataStream.pipe(jsonParser);
};

const categorizePatient = async () => {

    const category = {};
    const stream = getDataStream();
    const fileName = './output/updatedRecord.json';
    if(fs.existsSync(fileName)) {
        fs.unlinkSync(fileName)
    }
    fs.writeFileSync(fileName,'[')
    stream
        .pipe(es.map(patientRecord => {
            const bmiDetail = checkBMI(patientRecord);
            const bmiType = bmiDetail && bmiDetail.label ? bmiDetail.label : 'error';
            category[bmiType] = category[bmiType] ? (category[bmiType] + 1) : 1;
            if(bmiType !== 'error') {
                patientRecord.BMICategory = bmiType;
                patientRecord.HealthRisk = bmiDetail.risk;
                fs.appendFileSync(fileName,`${JSON.stringify(patientRecord)},\r\n`)
            }
        }))
    const fileStreamPromise = new Promise(resolve => stream.on('end', () => { resolve() }));
    await fileStreamPromise;
    fs.appendFileSync(fileName, ']')
    return category;
};

module.exports = {
    categorizePatient
}