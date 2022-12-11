// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
// } from 'typeorm';

// @Entity({ name: 'employees_history' })
// export class EmployeeHistoryEntity {
//   @PrimaryGeneratedColumn({ name: 'id' })
//   Id: string;

//   @Column({ type: 'int', name: 'employee_id' })
//   EmployeeId: number;

//   @Column({ type: 'varchar', name: 'pbs_employee_id' })
//   PbsEmployeeId: string;

//   @Column({ type: 'varchar', name: 'serial_number' })
//   SerialNumber: string;

//   @Column({ type: 'varchar', name: 'last_pbs_update' })
//   PBSLastUpdate: string;

//   @Column({ type: 'boolean', name: 'is_inactive' })
//   IsInactive: string;

//   @CreateDateColumn({ name: 'created_at' })
//   CreatedAt: Date;
// }
