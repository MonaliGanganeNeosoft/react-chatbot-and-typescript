import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity({ name: 'verifications' })
export class VerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn()
  user: string | UsersEntity;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'expiry', type: 'timestamptz' })
  expiry: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
