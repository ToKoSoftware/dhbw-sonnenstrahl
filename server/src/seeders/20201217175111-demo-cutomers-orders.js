'use strict';
const faker = require('faker');
const v4 = require("uuid").v4;
const bcrypt =  require('bcryptjs');

const SALT_FACTOR = 10;
        
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

function randomTime(start, end) {
    var diff =  end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        //200 User 
        let users = [];
        for (let i = 0; i <= 199; i++) {
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            users.push({
                id: v4(),
                email: faker.internet.email(),
                password: hashedPassword,
                is_admin: false,
                createdAt: randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                updatedAt: randomTime(new Date("07-01-2020 10:30"), new Date("12-31-2020 02:10"))
            });
        }
        await queryInterface.bulkInsert('Users', users);
        
        
        let customers =[];
        await queryInterface.sequelize.query('SELECT postcode FROM "Plans";', { type: queryInterface.sequelize.QueryTypes.SELECT })
        .then(function(plans) {

            //200 Customer, die zu User gehören
            for (let i = 0; i <= 199; i++) {
                customers.push({
                    id: v4(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    street: faker.address.streetName(),
                    streetNumber: faker.random.number(),
                    postcode: plans[getRandomInt(384)].postcode,
                    city: faker.address.city(),
                    createdAt:randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                    updatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10")),
                    userId: users[i].id,
                });
            }

            //50 Customer, die zu User gehören, die schon einen Customer haben
            for (let i = 0; i <= 49; i++) {
                customers.push({
                    id: v4(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    street: faker.address.streetName(),
                    streetNumber: faker.random.number(),
                    postcode: plans[getRandomInt(384)].postcode,
                    city: faker.address.city(),
                    createdAt: randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                    updatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10")),
                    userId: users[i].id,
                });
            }
        }),
        await queryInterface.bulkInsert('Customers', customers);


        //250 Customer (175 (70%) haben eine Order)
        let orders = [];
        let referrers = ['VERIVOX', 'CHECK24', 'switchup', 'Stromvergleich', 'Wechselpiraten'];
        await queryInterface.sequelize.query('SELECT Id FROM "Plans";', { type: queryInterface.sequelize.QueryTypes.SELECT })
        .then(function(plans) {
        
            for (let i = 0; i <= 249; i++) {
                orders.push({
                    id: v4(),
                    customerId: customers[i].id,
                    planId: plans[getRandomInt(384)].id, 
                    referrer: referrers[getRandomInt(5)],
                    consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                    is_active: true,
                    createdAt: randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                    updatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10")),
                    terminatedAt: null,
                });
            }
        
            //65 (25%) Customer haben eine und eine gecancelte Order
            for (let i = 0; i <= 64; i++) {
                orders.push({
                    id: v4(),
                    customerId: customers[i].id,
                    planId: plans[getRandomInt(384)].id, 
                    referrer: referrers[getRandomInt(5)],
                    consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                    is_active: false,
                    createdAt: randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                    updatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10")),
                    terminatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10")),
                });
            }

            //10 (5%) haben 2 Orders
            for (let i = 65; i <= 74; i++) {
                orders.push({
                    id: v4(),
                    customerId: customers[i].id,
                    planId: plans[getRandomInt(384)].id, 
                    referrer: referrers[getRandomInt(5)],
                    consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                    is_active: true,
                    createdAt: randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                    updatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10")),
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
