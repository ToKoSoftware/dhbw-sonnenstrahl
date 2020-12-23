'use strict';
const faker = require('faker');
const v4 = require("uuid").v4;
const bcrypt =  require('bcryptjs');
const timeFunc = require ('../functions/random-time.func');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let users = [];
        for (let i = 0; i <= 199; i++) {
            const u = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
            const SALT_FACTOR = 10;
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            users.push({
                id: v4(),
                email: faker.internet.email(),
                password: hashedPassword,
                is_admin: false,
                createdAt: u,
                updatedAt: timeFunc.randomTime(u, timeFunc.endTime)
            });
        }
        await queryInterface.bulkInsert('Users', users);

    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
