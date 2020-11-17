import {Table, Column, Model, HasMany, BeforeCreate} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {IncomingOrder} from '../interfaces/orders.interface';

@Table
export class Order extends Model<Order> {

    public static requiredFields(): Array<keyof IncomingOrder> {
        return [
            'city',
            'consumption',
            'firstName',
            'lastName',
            'rateId',
            'zipCode',
            'agent',
            'street',
            'streetNumber'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Order) {
        return instance.id = uuidv4();
    }

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    street: string;

    @Column
    streetNumber: string;

    @Column
    postcode: string;

    @Column
    city: string;

    @Column
    referrer: string;

    @Column
    planId: string;

    @Column
    consumption: number;

    @Column
    is_active: boolean;
}
