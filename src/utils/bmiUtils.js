'use strict'

const { isInRange } = require('./util');

/**
 * Calculate the BMI value
 * @param {number} heightCm 
 * @param {number} weightKg 
 * @returns {number} calculated BMI
 */
 const calculateBMI = (heightCm, weightKg) =>  weightKg / ((heightCm / 100) * 2);

/**
 * Find the BMI details for the BMI value
 * @param {number} bmi 
 * @returns Matching bmi record for the BMI
 */
const getBMIdetail = (bmi) => {

    const bmiMapping = require('../../constants/bmi.json');
    return bmiMapping.filter(category => isInRange(bmi, category.range));
};

/**
 * Find patient BMI category details
 * @param {object} patient 
 * @returns Get the bmi detail for the patient
 */
 const getPatientBMIDetails = (patient) => {

    const bmi = calculateBMI(patient.HeightCm, patient.WeightKg);
    return getBMIdetail(bmi)[0];
};

module.exports = {
    getPatientBMIDetails
}