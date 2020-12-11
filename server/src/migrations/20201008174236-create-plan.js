'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Plans', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.UUID,
            },
            postcode: {
                type: Sequelize.STRING
            },
            plan: {
                type: Sequelize.STRING
            },
            cost_var: {
                type: Sequelize.INTEGER
            },
            cost_fix: {
                type: Sequelize.INTEGER
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
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
