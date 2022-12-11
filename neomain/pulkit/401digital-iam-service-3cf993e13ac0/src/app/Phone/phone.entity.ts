import { Entity, Column,PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user_sip' })
export class UserSipEntity {

    @PrimaryGeneratedColumn({name: 'id'})
      id: string;

    @Column({name:'userid',type: 'varchar',unique:true})
    userid:string

    @Column({name:'name',type: 'varchar',nullable:true})
    name: string;

    @Column({name:'email',type: 'varchar'})
    email: string;

    @Column({name:'sip_device_id',type: 'varchar'})
    sip_device_id: string;

    @Column({name:'sip_password',type: 'varchar'})
    sip_password: string;

    @Column({name:'sip_realm',type: 'varchar'})
    sip_realm: string;

    @Column({name:'sip_username',type: 'varchar'})
    sip_username:string

    @Column({name:'sip_enforce_security'})
    sip_enforce_security:boolean
}