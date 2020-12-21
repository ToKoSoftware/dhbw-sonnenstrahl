import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {InternalPlan} from '../interfaces/plan.interface';

@Table
export class Plan extends Model<Plan> {

    @Column
    postcode: string;
    @Column
    plan: string;
    @Column
    cost_var: number;
    @Column
    cost_fix: number;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof InternalPlan> {
        return [
            'postcode',
            'plan',
            'cost_var',
            'cost_fix'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Plan): string {
        return instance.id = uuidv4();
    }
}
