'use strict';
const faker = require('faker');
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');
const timeFunc = require ('../functions/random-time.func');

const SALT_FACTOR = 10;
     
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        //200 user 
        let users = [];
        for (let i = 0; i < 200; i++) {
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            const date = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
            users.push({
                id: v4(),
                email: faker.internet.email(),
                password: hashedPassword,
                is_admin: false,
                createdAt: date,
                updatedAt: timeFunc.randomTime(date, timeFunc.endTime)
            });
        }
        await queryInterface.bulkInsert('Users', users);
        
        let customers =[];
        let orders = [];
        let referrers = ['VERIVOX', 'CHECK24', 'VERIVOX', 'CHECK24', 'VERIVOX', 'CHECK24', 'Sonnenstrahl-Website', 'Sonnenstrahl-Website', 'Sonnenstrahl-Website', 'Sonnenstrahl-Website', 'Wechselpiraten'];

        await queryInterface.sequelize.query('SELECT id, postcode FROM "Plans";', { type: queryInterface.sequelize.QueryTypes.SELECT })
            .then(async function(plans) {

                //200 customer with belonging User
                for (let i = 0; i < 200; i++) {
                    customers.push({
                        id: v4(),
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        street: faker.address.streetName(),
                        streetNumber: faker.random.number(),
                        postcode: plans[i].postcode,
                        city: faker.address.city(),
                        createdAt: users[i].createdAt,
                        updatedAt: timeFunc.randomTime(users[i].createdAt, timeFunc.endTime),
                        userId: users[i].id,
                        is_active: true
                    });
                }

                //50 customer added to a User with already a customer
                for (let i = 0; i < 50; i++) {
                    const date = timeFunc.randomTime(users[i].createdAt, timeFunc.endTime);
                    customers.push({
                        id: v4(),
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        street: faker.address.streetName(),
                        streetNumber: faker.random.number(),
                        postcode: plans[i+200].postcode,
                        city: faker.address.city(),
                        createdAt: date,
                        updatedAt: timeFunc.randomTime(date, timeFunc.endTime),
                        userId: users[i].id,
                        is_active: true,
                    });
                }

                await queryInterface.bulkInsert('Customers', customers);

                //250 orders added
                for (let i = 0; i <= 249; i++) {
                    orders.push({
                        id: v4(),
                        customerId: customers[i].id,
                        planId: plans[i].id, 
                        referrer: referrers[getRandomInt(referrers.length - 1)],
                        consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                        is_active: true,
                        createdAt: customers[i].createdAt,
                        updatedAt: timeFunc.randomTime(customers[i].createdAt, timeFunc.endTime),
                        terminatedAt: null,
                    });
                }
            
                //65 orders added to customers with already an order
                for (let i = 0; i < 65; i++) {
                    const dateCreatedAt = timeFunc.randomTime(customers[i].createdAt, timeFunc.endTime);
                    const dateUpdatedAt = timeFunc.randomTime(dateCreatedAt, timeFunc.endTime);
                    orders.push({
                        id: v4(),
                        customerId: customers[i].id,
                        planId: plans[i].id, 
                        referrer: referrers[getRandomInt(referrers.length - 1)],
                        consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                        is_active: false,
                        createdAt: dateCreatedAt,
                        updatedAt: dateUpdatedAt,
                        terminatedAt: dateUpdatedAt,
                    });
                }

                //10 orders added to customer with already an order
                for (let i = 65; i <= 74; i++) {
                    const date =  timeFunc.randomTime(customers[i].createdAt, timeFunc.endTime);
                    orders.push({
                        id: v4(),
                        customerId: customers[i].id,
                        planId: plans[i].id, 
                        referrer: referrers[getRandomInt(referrers.length - 1)],
                        consumption: [1600, 1600, 1600, 1600, 2400, 2400, 2400, 3200, 4000, 4500].reduce((a, c, i, o) => { return o[Math.floor(Math.random() * Math.floor(o.length))]; }),
                        is_active: true,
                        createdAt: date,
                        updatedAt: timeFunc.randomTime(date, timeFunc.endTime),
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
