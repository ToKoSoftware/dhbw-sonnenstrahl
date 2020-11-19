import {Table, Column, Model, HasMany, BeforeCreate} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IncomingPlan } from '../interfaces/plan.interface';

@Table
export class Plan extends Model<Plan> {

    public static requiredFields(): Array<keyof IncomingPlan> {
        return [
            'PLZ',
            'Tarifname',
            'VariableKosten',
            'Fixkosten'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Plan) {
        return instance.id = uuidv4();
    }

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
}
