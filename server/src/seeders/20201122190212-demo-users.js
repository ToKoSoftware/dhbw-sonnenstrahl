'use strict';
const faker = require('faker');
const v4 = require("uuid").v4;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let users = [];
        for (let i = 0; i <= 200; i++) {
            users.push({
                id: v4(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                is_admin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await queryInterface.bulkInsert('Users', users);

    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
