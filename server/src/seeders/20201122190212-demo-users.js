'use strict';
const faker = require('faker');
const v4 = require("uuid").v4;
const bcrypt =  require('bcryptjs');

function randomTime(start, end) {
    var diff =  end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let users = [];
        for (let i = 0; i <= 199; i++) {
            const SALT_FACTOR = 10;
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            users.push({
                id: v4(),
                email: faker.internet.email(),
                password: hashedPassword,
                is_admin: false,
                createdAt:   randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
                updatedAt: randomTime(new Date("07-01-2020 10:30"), new Date("12-31-2020 02:10"))
            });
        }
        await queryInterface.bulkInsert('Users', users);

    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
