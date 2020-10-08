import {Vars} from "../vars";
import Loggy from "../functions/loggy.func";
import {loadConfig} from "../bootstrap/load-config.func";


Vars.loggy = new Loggy();
Vars.config = loadConfig();

module.exports = {
    development: {
        username: Vars.config.database.username,
        password: Vars.config.database.password,
        database: Vars.config.database.dbname,
        host: Vars.config.database.url,
        port: Vars.config.database.port,
        dialect: 'postgres'
    },
    production: {
        username: Vars.config.database.username,
        password: Vars.config.database.password,
        database: Vars.config.database.dbname,
        host: Vars.config.database.url,
        port: Vars.config.database.port,
        dialect: 'postgres'
    },
    test: {
        username: Vars.config.database.username,
        password: Vars.config.database.password,
        database: Vars.config.database.dbname,
        host: Vars.config.database.url,
        port: Vars.config.database.port,
        dialect: 'postgres'
    },
};
