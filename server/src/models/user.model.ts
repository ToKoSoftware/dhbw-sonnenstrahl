import {Table, Column, Model, HasMany} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    email: string
}
