'use strict';

//Update table Customers

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Customers', 'is_active', Sequelize.BOOLEAN);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Customers', 'is_active');
    }
};
