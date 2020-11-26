import {Table, Column, Model, HasMany, BeforeCreate} from 'sequelize-typescript';
import {v4 as uuidv4} from "uuid";
import {InternalUser} from '../interfaces/users.interface';

@Table
export class User extends Model<User> {

    public static requiredFields(): Array<keyof InternalUser> {
        return [
            'email',
            'password'
        ];
    }

    @BeforeCreate
    static addUuid(instance: User) {
        return instance.id = uuidv4();
    }

    @Column
    customerId?: string;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    is_admin: boolean;
}
