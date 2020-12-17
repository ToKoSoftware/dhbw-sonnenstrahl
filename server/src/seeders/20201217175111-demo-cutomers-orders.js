'use strict';
const faker = require('faker');
const v4 = require("uuid").v4;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        //200 User 
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
        
        
        let customers =[];
        await queryInterface.sequelize.query('SELECT postcode FROM "Plans";', { type: queryInterface.sequelize.QueryTypes.SELECT })
        .then(function(plans) {

            //200 Customer, die zu User gehören
            for (let i = 0; i <= 200; i++) {
                customers.push({
                    id: v4(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    street: faker.address.streetName(),
                    streetNumber: faker.random.number(),
                    postcode: plans[getRandomInt(384)].postcode,
                    city: faker.address.city(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId: users[i].id,
                });
            }

            //50 Customer, die zu User gehören, die schon einen Customer haben
            for (let i = 0; i <= 50; i++) {
                customers.push({
                    id: v4(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    street: faker.address.streetName(),
                    streetNumber: faker.random.number(),
                    postcode: plans[getRandomInt(384)].postcode,
                    city: faker.address.city(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId: users[i].id,
                });
            }
        }),
        await queryInterface.bulkInsert('Customers', customers);


        //250 Customer (175 (70%) haben eine Order)
        let orders = [];
        await queryInterface.sequelize.query('SELECT Id FROM "Plans";', { type: queryInterface.sequelize.QueryTypes.SELECT })
        .then(function(plans) {
        
            for (let i = 0; i <= 250; i++) {
                orders.push({
                    id: v4(),
                    customerId: customers[i].id,
                    planId: plans[getRandomInt(384)].id, 
                    referrer: 'SEEDER',
                    consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    terminatedAt: null,
                });
            }
        
            //65 (25%) Customer haben eine und eine gecancelte Order
            for (let i = 0; i <= 64; i++) {
                orders.push({
                    id: v4(),
                    customerId: customers[i].id,
                    planId: plans[getRandomInt(384)].id, 
                    referrer: 'SEEDER',
                    consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                    is_active: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    terminatedAt: new Date(),
                });
            }

            //10 (5%) haben 2 Orders
            for (let i = 65; i <= 74; i++) {
                orders.push({
                    id: v4(),
                    customerId: customers[i].id,
                    planId: plans[getRandomInt(384)].id, 
                    referrer: 'SEEDER',
                    consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    terminatedAt: null,
                });
            }
        })
        return queryInterface.bulkInsert('Orders', orders);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
        await queryInterface.bulkDelete('Orders', null, {});
        return queryInterface.bulkDelete('Customers', null, {});
    }
}
