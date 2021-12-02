'use strict'

const { categorizePatient, getOverweightPatients } = require('./utils/util');

const init = async () => {

    try {
        const patientCategoryCount = await categorizePatient();
        const totalPatients = Object.values(patientCategoryCount).reduce((a, b) => a + b, 0);
        if (patientCategoryCount.error) {
            console.log(`${patientCategoryCount.error} record(s) have error`);
        }
        console.log(`${patientCategoryCount.Overweight | 0} out of ${totalPatients} patients are of 'Overweight' category`);
    }
    catch (e) {
        console.error(e)
    }
}

init();
