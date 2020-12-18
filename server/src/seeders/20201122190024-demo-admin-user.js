'use strict';
const v4 = require("uuid").v4;
const bcrypt =  require('bcryptjs');

function randomTime(start, end) {
    var diff =  end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('qwertz123', SALT_FACTOR);
        return queryInterface.bulkInsert('Users', [{
            id: v4(),
            email: 'sabrina.wassertal@sonnenstrahl-energie.com',
            password:  hashedPassword,
            is_admin: true,
            createdAt: randomTime(new Date("01-01-2020 10:30"), new Date("06-30-2020 02:10")),
            updatedAt: randomTime(new Date("06-30-2020 10:30"), new Date("12-31-2020 02:10"))
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
