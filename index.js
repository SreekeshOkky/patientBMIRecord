'use strict'

const { categorizePatient } = require('./src/utils/patientUtil');

const init = async () => {

    try {
        const patientCategoryCount = await categorizePatient('patients.json');
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
