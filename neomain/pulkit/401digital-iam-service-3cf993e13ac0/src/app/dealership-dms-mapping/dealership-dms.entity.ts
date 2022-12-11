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
  import { DealershipEntity } from '../dealership/dealership.entity';

  @Entity({ name: 'dealership_dms_mapping' })
  export class DealershipDmsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
      type: 'varchar',
      name: 'dealership_id'
    })
    dealershipId: string;
   
    @ManyToOne(() => DealershipEntity, (dealership) => dealership.id)
    @JoinColumn({ name: 'dealership_id' })
    dealership: string | DealershipEntity;

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
  
  