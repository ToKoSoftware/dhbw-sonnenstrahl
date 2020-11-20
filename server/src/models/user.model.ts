import {Table, Column, Model, HasMany, BeforeCreate} from 'sequelize-typescript';
import {v4 as uuidv4} from "uuid";
import {IncomingUser} from '../interfaces/users.interface';

@Table
export class User extends Model<User> {

    public static requiredFields(): Array<keyof IncomingUser> {
        return [
            'firstName',
            'lastName',
            'email',
            'password'
        ];
    }

    @BeforeCreate
    static addUuid(instance: User) {
        return instance.id = uuidv4();
    }

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    is_admin: boolean;
}
