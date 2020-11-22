'use strict';
const faker = require('faker');
const v4 = require("uuid").v4;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let users = [];
        for (let i = 0; i <= 100; i++) {
            users.push({
                id: v4(),
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: faker.internet.password(),
                is_admin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await queryInterface.bulkInsert('Users', users);

        let orders = [];
        for (let i = 0; i <= 100; i++) {
            orders.push({
                id: v4(),
                firstName: users[i].firstName,
                lastName: users[i].lastName,
                street: faker.address.streetName(),
                city: faker.address.city(),
                referrer: 'SEEDER',
                consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                streetNumber: faker.random.number(),
                postcode: ['89518', '89522', '89520'].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                planId: 'TODO', // todo generate plans
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        return queryInterface.bulkInsert('Orders', orders);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
