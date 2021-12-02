'use strict'

const { isInRange } = require('./util');

/**
 * 
 * @param {number} heightCm 
 * @param {number} weightKg 
 * @returns {number} calculated BMI
 */
 const calculateBMI = (heightCm, weightKg) => {

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * 2);
    return bmi;
};

/**
 * 
 * @param {number} bmi 
 * @returns Matching bmi record for the BMI
 */
const getBMIdetail = (bmi) => {

    const bmiMapping = require('../../constants/bmi.json');
    return bmiMapping.filter(category => isInRange(bmi, category.range));
};

/**
 * 
 * @param {object} patient 
 * @returns Get the bmi detail for the patient
 */
 const checkBMI = (patient) => {

    const bmi = calculateBMI(patient.HeightCm, patient.WeightKg);
    const bmiDetail = getBMIdetail(bmi);

    return bmiDetail[0];
};

module.exports = {
    checkBMI
}