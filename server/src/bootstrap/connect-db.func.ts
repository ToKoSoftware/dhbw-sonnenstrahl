import { Sequelize } from 'sequelize';
import {Vars} from "../vars";

export function connectToDatabase(){
    const sequelize = new Sequelize(
        `postgres://${Vars.config.database.username}:${Vars.config.database.password}@${Vars.config.database.url}:${Vars.config.database.port}/${Vars.config.database.dbname}`
    )
    try {
        sequelize.authenticate().then(
            () => Vars.loggy.info('Connection has been established successfully.')
        );
    } catch (error) {
        Vars.loggy.error('Unable to connect to the database:', error);
    }
}
