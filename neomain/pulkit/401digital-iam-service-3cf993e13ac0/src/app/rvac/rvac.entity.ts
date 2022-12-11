import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'rvac_options' })
export class RvacEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'rvac_type', length: 250 })
    rvacType: string;

}