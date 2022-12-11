import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'provinces' })
export class ProvinceEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'code', unique: true })
    code: string;

    @Column({ name: 'countrycode', nullable: true })
    countrycode: string;
}
