import { DealershipEntity } from '../dealership/dealership.entity';
import { UsersEntity } from '../users/users.entity';
import { WarrantyPlanOptionEntity } from '../warranty/warrantyPlanOptions.entity';
import { LienholderEntity } from '../lienholder/lienholder.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'contracts' })
export class ContractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId: number;
  
  @ManyToOne(() => DealershipEntity, (dealer) => dealer.id)
  @JoinColumn({ name: 'dealer_id', referencedColumnName: 'id' })
  dealerId: number;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ length: 30 })
  telephone: string;

  @Column({ name: 'work_telephone', length: 30, nullable: true })
  workTelephone: string;

  @Column({ name: 'street_address', length: 100 })
  streetAddress: string;

  @Column({ length: 45 })
  city: string;

  @Column({ length: 45 })
  province: string;

  @Column({ name: 'postal_code', length: 45 })
  postalCode: string;

  @Column({ name: 'tax_exempt_status_card_num', length: 100, nullable: true })
  taxExemptStatusCardNum: string;

  @Column({
    name: 'co_contract_holder_first_name',
    length: 100,
    nullable: true,
  })
  coContractHolderFirstName: string;

  @Column({ name: 'co_contract_holder_last_name', length: 100, nullable: true })
  coContractHolderLastName: string;

  @Column({ name: 'co_contract_holder_telephone', length: 20, nullable: true })
  coContractHolderTelephone: string;

  @Column({ name: 'unit_year', length: 10 })
  unitYear: string;

  @Column({ name: 'unit_make', length: 100 })
  unitMake: string;

  @Column({ name: 'unit_model', length: 100, nullable: true })
  unitModel: string;

  @Column({ name: 'unit_odometer', length: 100, nullable: true })
  unitOdometer: string;

  @Column({ name: 'unit_price', length: 255, nullable: true })
  unitPrice: string;

  @Column({ name: 'unit_vin_number', length: 255 })
  unitVinNumber: string;

  @Column({ name: 'unit_purchase_date', nullable: true })
  unitPurchaseDate: Date;

  @Column({ name: 'unit_purchase_price', length: 255, nullable: true })
  unitPurchasePrice: string;

  @Column({ name: 'unit_contract_expiry_date', nullable: true })
  unitContractExpiryDate: Date;

  @ManyToOne(() => LienholderEntity, (leanHolder) => leanHolder.id)
  @JoinColumn({ name: 'lean_holder_id', referencedColumnName: 'id' })
  leanHolder: LienholderEntity;

  @Column({ name: 'contract_number', nullable: true })
  contractNumber: string;

  @Column({
    name: 'contract_type',
    type: 'enum',
    enum: ['nationall', 'allaround', 'maintenance'],
  })
  contractType: string;

  @Column({ name: 'total_price', length: 50, nullable: true })
  totalPrice: string;

  @Column({ name: 'warranty_price', length: 50, nullable: true })
  warrantyPrice: string;

  @ManyToOne(
    () => WarrantyPlanOptionEntity,
    (warrantyPlanOption) => warrantyPlanOption.id,
  )
  @JoinColumn({ name: 'warranty_plan_id', referencedColumnName: 'id' })
  warrantyPlanId: number | null;

  @Column({ name: 'contract_date', length: 20, nullable: true })
  contractDate: string;

  @Column({ name: 'in_service_date', length: 20, nullable: true })
  inServiceDate: string;

  @Column({ name: 'coverage_begins_date', length: 20, nullable: true })
  coverageBeginsDate: string;

  @Column({ name: 'unit_stock_number', length: 20 })
  unitStockNumber: string;

  @Column({
    name: 'vehicle_age',
    type: 'enum',
    enum: ['New', 'Pre-Owned'],
    nullable: true,
  })
  vehicleAge: string;

  @Column({ name: 'service_details', type: 'text', nullable: true })
  serviceDetails: string;

  @Column({
    name: 'base_fee',
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  baseFee: number;

  @Column({
    name: 'warrantyFee',
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  warrantyFee: number;

  @Column({ name: 'warranty_service', type: 'text', nullable: true })
  warranty_service: string;

  @Column({
    name: 'option_price',
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  optionPrice: number;

  @Column({
    type: 'enum',
    default: 'Draft',
    enum: ['Draft', 'Void', 'Unsigned', 'Signed', 'Expired'],
  })
  status: string;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @Column('timestamp', {
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: string;
}
