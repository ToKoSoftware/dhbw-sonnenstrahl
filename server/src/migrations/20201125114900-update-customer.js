'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Customer', 'is_active', Sequelize.BOOLEAN);
  },
  down: async (queryInterface, Sequelize) =>{
      await queryInterface.removeColumn('Customer', 'is_active');
  }
};
