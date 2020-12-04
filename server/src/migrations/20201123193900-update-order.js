'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
    await queryInterface.createTable('Orders', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      planId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      referrer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      consumption: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      },
      terminatedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
    await queryInterface.dropTable('Users');
    await queryInterface.createTable('Users', {
        id: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.UUID,
        },
        customerId: {
          type: Sequelize.UUID,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        is_admin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
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
      await queryInterface.createTable('Customers', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: Sequelize.UUID,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false
        },
        streetNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        postcode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
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
    await queryInterface.dropTable('Orders');
    await queryInterface.createTable('Orders', {
        id: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.UUID,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        street: {
          type: Sequelize.STRING,
          allowNull: false
        },
        streetNumber: {
          type: Sequelize.STRING,
          allowNull: false
        },
        postcode: {
          type: Sequelize.STRING,
          allowNull: false
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false
        },
        referrer: {
          type: Sequelize.STRING,
          allowNull: false
        },
        planId: {
          type: Sequelize.STRING,
          allowNull: false
        },
        consumption: {
          type: Sequelize.INTEGER,
          allowNull: false
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
    await queryInterface.dropTable('Users');
    await queryInterface.createTable('Users', {
        id: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.UUID,
        },
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        is_admin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
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
    await queryInterface.dropTable('Customers');
  }
};