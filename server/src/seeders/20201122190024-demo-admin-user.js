'use strict';
const v4 = require("uuid").v4;
const bcrypt =  require('bcryptjs');
const timeFunc = require ('../functions/random-time.func');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const date = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('qwertz123', SALT_FACTOR);
        return queryInterface.bulkInsert('Users', [{
            id: v4(),
            email: 'sabrina.wassertal@sonnenstrahl-energie.com',
            password:  hashedPassword,
            is_admin: true,
            createdAt: date,
            updatedAt: date
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
