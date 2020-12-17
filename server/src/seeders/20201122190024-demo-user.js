'use strict';
const v4 = require("uuid").v4;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            id: v4(),
            email: 'sabrina.wassertal@sonnenstrahl-energie.com',
            password: 'qwertz123',
            is_admin: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
