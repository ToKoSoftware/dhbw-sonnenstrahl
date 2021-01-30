/**
 * Load environment configurations
 * @type {{development: {password: *, database: *, dialect: string, port: *, seederStorage: string, host: *, username: *}, test: {password: *, database: *, dialect: string, port: *, host: *, username: *}, production: {password: *, database: *, dialect: string, port: *, host: *, username: *}}}
 */
module.exports = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_URL,
        port: process.env.DATABASE_PORT,
        dialect: 'postgres',
        seederStorage: 'sequelize',
    },
    production: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_URL,
        port: process.env.DATABASE_PORT,
        dialect: 'postgres'
    },
    test: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_URL,
        port: process.env.DATABASE_PORT,
        dialect: 'postgres'
    },
};
