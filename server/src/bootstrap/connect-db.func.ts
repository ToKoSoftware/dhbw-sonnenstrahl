import {Sequelize} from 'sequelize-typescript';
import {Vars} from "../vars";
import {User} from "../models/user.model";


export function connectToDatabase() {
    const sequelize = new Sequelize(
        `postgres://${Vars.config.database.username}:${Vars.config.database.password}@${Vars.config.database.url}:${Vars.config.database.port}/${Vars.config.database.dbname}`
    )
    try {
        sequelize.authenticate().then(
            () => Vars.loggy.info('Connection has been established successfully.')
        );
        // todo
        sequelize.addModels([User]);
        Vars.db = sequelize;
    } catch (error) {
        Vars.loggy.error('Unable to connect to the database:', error);
    }
}
