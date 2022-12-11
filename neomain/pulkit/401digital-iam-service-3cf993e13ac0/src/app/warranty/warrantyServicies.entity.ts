import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'warranty_services' })
export class WarrantyServiceEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'warranty_condition', length: 100 })
    warranty_condition: string;

    @Column({ name: 'warranty_class', length: 100 })
    warranty_class: string;

    @Column({ name: 'max_sp', length: 100 })
    max_sp: string;

    @CreateDateColumn({ nullable: true })
    created_at: Date;

    @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)" })
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at?: string;

}
