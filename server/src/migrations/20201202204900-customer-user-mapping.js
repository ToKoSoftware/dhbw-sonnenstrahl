'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Customers', 'userId', Sequelize.UUID);
        await queryInterface.removeColumn('Users', 'customerId');
    },

    down: async (queryInterface, Sequelize) =>{
        await queryInterface.removeColumn('Customers', 'userId');
        await queryInterface.addColumn('Users', 'customerId',Sequelize.UUID);
    }
  };