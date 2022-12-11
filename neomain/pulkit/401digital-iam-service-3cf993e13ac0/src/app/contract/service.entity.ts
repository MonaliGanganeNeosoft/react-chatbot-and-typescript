import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'services' })
export class ServiceEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'service_module', length: 100 })
    service_module: string;

    @Column({ name: 'max_sp', length: 100 })
    max_sp: string;

    @CreateDateColumn({ nullable: true })
    created_at: Date;

    @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)" })
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at?: string;
    
}
