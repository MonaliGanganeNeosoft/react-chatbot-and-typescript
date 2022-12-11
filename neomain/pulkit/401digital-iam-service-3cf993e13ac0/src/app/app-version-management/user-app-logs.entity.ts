import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    } from 'typeorm';
  
  @Entity({ name: 'userapp_version_logs' })
  export class UserAppVersionMasterEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;
    
    @Column({ name: 'app_type' })
    appType: string;
  
    @Column({ name: 'app_version'})
    appVersion: string;
  
    @Column({ name: 'isAppUpdated', type: 'boolean', default: false })
    IsAppUpdated: boolean;
  
    @Column({ name: 'is_active', type: 'boolean', default: false })
    IsActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  