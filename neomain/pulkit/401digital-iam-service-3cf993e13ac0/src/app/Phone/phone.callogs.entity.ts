import { Entity, Column,PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'sip_call_logs' })
export class UserCallLogsEntity {

    @PrimaryGeneratedColumn({name: 'id'})
      id: string;

    @Column({name:'userid',type: 'varchar'})
    userid:string

    @Column({name:'name',type: 'varchar'})
    name: string;

    @Column({name:'email',type: 'varchar'})
    email: string;

    @Column({name:'user_level',type: 'varchar',nullable:true})
    user_level: string;

    @Column({name:'clid',type: 'varchar'})
    clid: string;

    @Column({name:'flow',type: 'varchar'})
    flow: string;

    @Column({name:'callid',type: 'varchar'})
    callid:string

    @Column({name:'start_time',type: 'bigint',nullable:true})
    start_time:number

    @Column({name:'status'})
    status:string

    @Column({name:'end_time',type: 'bigint',nullable:true})
    end_time:number

    @Column({name:'uri'})
    uri:string
}