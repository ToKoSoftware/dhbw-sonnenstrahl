import { Table, Column, Model, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { InternalCustomer } from '../interfaces/customers.interface';

@Table
export class Customer extends Model<Customer> {

    public static requiredFields(): Array<keyof InternalCustomer> {
        return [
            'firstName',
            'lastName',
            'street',
            'streetNumber',
            'postcode',
            'city',
            'is_active'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Customer) {
        return instance.id = uuidv4();
    }

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
}
