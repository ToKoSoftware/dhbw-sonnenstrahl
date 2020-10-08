'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      postcode: {
        type: Sequelize.STRING
      },
      plan: {
        type: Sequelize.STRING
      },
      usage_min: {
        type: Sequelize.INTEGER
      },
      usage_max: {
        type: Sequelize.INTEGER
      },
      usage_n_min: {
        type: Sequelize.INTEGER
      },
      usage_n_max: {
        type: Sequelize.INTEGER
      },
      cost_var: {
        type: Sequelize.INTEGER
      },
      cost_n_var: {
        type: Sequelize.INTEGER
      },
      cost_fix: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Plans');
  }
};
