import {Table, Column, Model, HasMany} from 'sequelize-typescript';

@Table
export class Plan extends Model<Plan> {

    @Column
    id: string;

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
