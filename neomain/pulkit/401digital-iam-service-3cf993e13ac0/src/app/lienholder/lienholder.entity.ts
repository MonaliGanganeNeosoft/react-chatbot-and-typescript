import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { UsersEntity } from '../users/users.entity';

@Entity({ name: 'lienholders' })
export class LienholderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'company_name', length: 100 })
  companyName: string;

  @Column({ name: 'address_line_1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line_2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ name: 'city', length: 255, nullable: true })
  city: string;

  @Column({ name: 'province', length: 255, nullable: true })
  province: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @ManyToOne(() => DealerGroupEntity, (dealerGroup) => dealerGroup.id)
  @JoinColumn({ name: 'dealer_group_id' })
  dealerGroup: string | DealerGroupEntity;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: string;
}
