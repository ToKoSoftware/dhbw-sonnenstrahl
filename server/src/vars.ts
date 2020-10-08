import Loggy from './functions/loggy.func';
import {Configuration} from "./interfaces/configutation.interface";
import {Sequelize} from "sequelize-typescript";

export abstract class Vars {
    public static loggy: Loggy;
    public static config: Configuration;
    public static db: Sequelize;
}

export var apiDefaults = {
    apiUrl: 'https://services.dlrg.net/',
    apiEndpoint: 'service.php',
    stationQueryLimit: 100000, // the stupid api returns only 9 entries; if we want all we need to specify a ridiculous max count
};
