import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {InternalCustomer} from '../interfaces/customers.interface';

@Table
export class Customer extends Model<Customer> {

    @Column
    userId?: string;
    @Column
    firstName: string;
    @Column
    lastName: string;
    @Column
    street: string;
    @Column
    streetNumber: number;
    @Column
    postcode: string;
    @Column
    city: number;
    @Column
    is_active: boolean;

    //required fields for creations and updates
    public static requiredFields(): Array<keyof InternalCustomer> {
        return [
            'firstName',
            'lastName',
            'street',
            'streetNumber',
            'postcode',
            'city'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Customer): string {
        return instance.id = uuidv4();
    }
}
