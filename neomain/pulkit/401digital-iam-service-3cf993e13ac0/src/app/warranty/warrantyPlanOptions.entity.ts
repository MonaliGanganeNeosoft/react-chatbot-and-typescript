import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'warranty_plan_options'})
export class WarrantyPlanOptionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name:'warranty_plan_value',type: 'int' })
    warrantyPlanValue: number;

    @Column({ name:'warranty_plan_friendly',length:250 })
    warrantyPlanFriendly: string;

    @Column({ name:'warranty_plan_friendly_logic',length:250 })
    warrantyPlanFriendlyLogic: string;

    @Column({ name:'warranty_plan_status',length:250,default: 1 })
    warrantyPlanStatus: string;

    @Column({ name:'warranty_plan_pricing',length:250 })
    warrantyPlanPricing: string;
    
}