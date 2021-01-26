'use strict';
const v4 = require('uuid').v4;
const csv = require('csvtojson');
const path = require('path');

//Initial insert of plan/rate data into database

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const incomingData = await loadCSV();
        const targetData = incomingData.map(mapPlan);
        await queryInterface.bulkInsert('Plans', targetData);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Plans', null, {});
    }
};

async function loadCSV() {
    return csv({
            delimiter: ';',
            colParser: {
                Fixkosten: transformEuroToCents,
                VariableKosten: transformEuroToCents
            }
        }
    ).fromFile(path.resolve(__dirname, '../../../data/sample-data.csv'));
};

function mapPlan(incomingPlan) {
    return {
        id: v4(),
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: incomingPlan.Fixkosten,
        cost_var: incomingPlan.VariableKosten,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

function transformEuroToCents(eur) {
    return Math.floor(Number(eur.replace(',', '.')) * 10000);
};
