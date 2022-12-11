import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity({ name: 'user_password' })
export class UserPasswordEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'userId' })
    userId: string;

    @ManyToOne(() => UsersEntity, (user) => user.id)
    @JoinColumn()
    user: string | UsersEntity;

    @Column({ name: 'password' })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}