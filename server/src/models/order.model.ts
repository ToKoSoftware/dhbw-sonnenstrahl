import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {InternalOrder} from '../interfaces/orders.interface';

@Table
export class Order extends Model<Order> {

    @Column
    customerId: string;
    @Column
    planId: string;
    @Column
    referrer: string;
    @Column
    consumption: number;
    @Column
    is_active: boolean;
    @Column
    terminatedAt: Date;

    public static requiredFields(): Array<keyof InternalOrder> {
        return [
            'customerId',
            'planId',
            'consumption'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Order) {
        return instance.id = uuidv4();
    }
}
