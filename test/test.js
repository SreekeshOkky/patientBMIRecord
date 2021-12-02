'use strict'

const expect = require('chai').expect;

describe('Validate BMI category', () => {

    const { getPatientBMIDetails } = require('./../src/utils/bmiUtils');

    it("Underweight", () => {

        const patient = {
            "Gender": "Male",
            "HeightCm": 170,
            "WeightKg": 45
        };
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail.label).to.equal('Underweight')
    });

    it("Normal wegiht", () => {

        const patient = {
            "Gender": "Male",
            "HeightCm": 180,
            "WeightKg": 77
        };
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail.label).to.equal('Normal weight')
    });

    it("Overwegiht", () => {

        const patient = {
            "Gender": "Female",
            "HeightCm": 180,
            "WeightKg": 100
        };
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail.label).to.equal('Overweight')
    });

    it("Severely wegiht", () => {

        const patient = {
            "Gender": "Male",
            "HeightCm": 100,
            "WeightKg": 77
        };
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail.label).to.equal('Severely obese')
    });

    it("Very severely obese", () => {

        const patient = {
            "Gender": "Male",
            "HeightCm": 170,
            "WeightKg": 145
        };
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail.label).to.equal('Very severely obese')
    });

    it("Incomplete data", () => {

        const patient = {
            "Gender": "Female",
            "HeightCm": 170
        };
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail).to.be.a('undefined')
    });

    it("Empty data", () => {

        const patient = {};
        const bmiDetail = getPatientBMIDetails(patient);

        expect(bmiDetail).to.be.a('undefined')
    });
});

describe('Validate Patient record update', () => {

    const { processPatientrecord } = require('./../src/utils/patientUtil');

    it("Empty array", () => {
        const records = [];
        const updatedRecords = records.map(patient => processPatientrecord(patient, false))

        expect(updatedRecords).to.be.an('array').that.is.empty;
    });

    it("Record with BMI set", () => {
        const records = [{
            "Gender": "Female",
            "HeightCm": 180,
            "WeightKg": 100
        }];
        const updatedRecords = records.map(patient => processPatientrecord(patient, false))

        expect(updatedRecords[0]).to.have.property('BMICategory', 'Overweight');
    });

    it("Incomplete data, no BMI set", () => {
        const records = [{
            "Gender": "Male",
            "HeightCm": 180
        }];
        const updatedRecords = records.map(patient => processPatientrecord(patient, false))
        
        expect(updatedRecords[0]).to.not.have.property('BMICategory');
    });

});