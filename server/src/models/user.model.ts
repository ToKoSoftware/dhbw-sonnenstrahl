import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {InternalUser} from '../interfaces/users.interface';

@Table
export class User extends Model<User> {

    @Column
    email: string;
    @Column
    password: string;
    @Column
    is_admin: boolean;

    public static requiredFields(): Array<keyof InternalUser> {
        return [
            'email',
            'password'
        ];
    }

    @BeforeCreate
    static addUuid(instance: User): string {
        return instance.id = uuidv4();
    }
}
