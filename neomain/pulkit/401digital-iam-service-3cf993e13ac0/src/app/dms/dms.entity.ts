import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany
  } from 'typeorm';
  
  import { DealershipDmsEntity } from '../dealership-dms-mapping/dealership-dms.entity';
  import { UserDmsEntity } from '../user-dms-mapping/userDms.entity';

  @Entity({ name: 'dms' })
  export class DmsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
      type: 'varchar',
      name: 'dms_name'
    })
    dmsName: string;
    
    @Column({ 
      type: 'varchar',
      name: 'dms_number' 
    })
    dmsNumber: string;
  
    @Column({ 
      type: 'varchar',
      name: 'dms_type' 
    })
    dmsType: string;
  
    @OneToMany(() => DealershipDmsEntity, (dmsDealerhip) => dmsDealerhip.dms)
    dmsDealerhip: string;

    @OneToMany(() => UserDmsEntity, (dmsUser) => dmsUser.dms)
    user: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  