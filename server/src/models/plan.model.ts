import {Table, Column, Model, HasMany, BeforeCreate} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Plan extends Model<Plan> {
    @BeforeCreate
    static addUuid(instance: Plan) {
        return instance.id = uuidv4();
    }

    @Column
    postcode: string;

    @Column
    plan: string;

    @Column
    usage_min: number;

    @Column
    usage_max: number;

    @Column
    usage_n_min: number;

    @Column
    usage_n_max: number;

    @Column
    cost_var: number;

    @Column
    cost_n_var: number;

    @Column
    cost_fix: number;

    @Column
    is_active: boolean;
}
