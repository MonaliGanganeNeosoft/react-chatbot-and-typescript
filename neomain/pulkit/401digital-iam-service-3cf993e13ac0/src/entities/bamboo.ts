
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'bamboo' })
export class BambooEntity {
    @PrimaryGeneratedColumn()
    uuid: number;

    @Column({
        type: 'int',
        name: 'id',
        nullable: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'display_name',
        nullable: true,
    })
    displayName: string;

    @Column({
        name: 'first_name',
        type: 'varchar',
        nullable: true,
    })
    firstName: string;

    @Column({
        name: 'last_name',
        type: 'varchar',
        nullable: true,
    })
    lastName: string;

    @Column({
        name: 'preferred_name',
        type: 'varchar',
        nullable: true,
    })
    preferredName: string;

    @Column({
        name: 'job_title',
        type: 'varchar',
        nullable: true,
    })
    jobTitle: string;

    @Column({
        name: 'work_phone',
        type: 'varchar',
        nullable: true,
    })
    workPhone: string;

    @Column({ // create oreign key
        name: 'work_email',
        type: 'varchar',
        nullable: true,
    })
    workEmail: string;

    @Column({
        name: 'department',
        type: 'varchar',
        nullable: true,
    })
    department: string;

    @Column({
        name: 'location',
        type: 'varchar',
        nullable: true,
    })
    location: string;

    @Column({
        name: 'division',
        type: 'varchar',
        nullable: true,
    })
    division: string;

    @Column({
        name: 'work_phone_extension',
        type: 'varchar',
        nullable: true,
    })
    workPhoneExtension: string;

    @Column({
        name: 'supervisor',
        type: 'varchar',
        nullable: true,
    })
    supervisor: string;

    @Column({
        name: 'photo_uploaded',
        type: 'boolean',
        nullable: true,
    })
    photoUploaded: boolean;

    @Column({
        name: 'photo_url',
        nullable: true,
        type: 'varchar',
    })
    photoUrl: string;

    @Column({
        name: 'can_upload_photo',
        nullable: true,
        type: 'int'
    })
    canUploadPhoto: number;

    @Column({
        name: 'level',
        nullable: true,
        type: 'varchar'
    })
    level: string;

    @Column({
        name: 'hire_date',
        nullable: true,
        type: 'date'
    })
    hireDate: Date;

    @Column({
        name: 'customshowonwebsite',
        nullable: true,
        type: 'boolean',
        default: false
    })
    customshowonwebsite: boolean;

    @Column({
        name: 'internal_sort',
        nullable: true,
        type: 'int'
    })
    internalSort: Number;

    @Column({
        name: 'is_read',
        nullable: true,
        type: 'boolean',
        default: true
    })
    is_read: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
