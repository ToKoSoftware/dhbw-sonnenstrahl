'use strict';
const v4 = require("uuid").v4;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            id: v4(),
            firstName: 'Sabrina',
            lastName: 'Wassertal',
            email: 'sabrina.wassertal@sonnenstrahl-energie.com',
            is_admin: true,
            password: 'qwertz123',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete('Users', null, {});
    }
};
