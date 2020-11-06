import Loggy from './functions/loggy.func';
import {Configuration} from "./interfaces/configutation.interface";
import {Op, Sequelize} from 'sequelize';


export abstract class Vars {
    public static loggy: Loggy;
    public static config: Configuration;
    public static db: Sequelize;
    public static op: typeof Op;
}
