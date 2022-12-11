import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { DmsEntity } from '../dms/dms.entity';
  import { UsersEntity } from '../users/users.entity';

  @Entity({ name: 'user_dms_mapping' })
  export class UserDmsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: string | UsersEntity;

    @ManyToOne(() => DmsEntity, (dms) => dms.id)
    @JoinColumn({ name: 'dms_id' })
    dms: string | DmsEntity;

    @Column({ name: 'status', type: 'boolean', default: 1 })
    status: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }