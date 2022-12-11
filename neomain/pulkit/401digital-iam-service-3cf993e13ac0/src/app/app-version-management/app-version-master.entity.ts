import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    } from 'typeorm';
  
  @Entity({ name: 'app_version_master' })
  export class AppVersionMasterEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ name: 'app_type' })
    appType: string;
  
    @Column({ name: 'app_latest_version'})
    appLatestVersion: string;
  
    @Column({ name: 'released_note'})
    releasedNote: string;
  
    @Column({ name: 'forceupdate', type: 'boolean', default: false })
    forceUpdate: boolean;
  
    @Column({ name: 'is_active', type: 'boolean', default: false })
    IsActive: boolean;

    @Column({ name: 'app_url'})
    appUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  