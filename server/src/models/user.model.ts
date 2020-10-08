import {Table, Column, Model, HasMany, BeforeCreate} from 'sequelize-typescript';
import {v4 as uuidv4} from "uuid";

@Table
export class User extends Model<User> {
    @BeforeCreate
    static addUuid(instance: User) {
        return instance.id = uuidv4();
    }

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    email: string
}
