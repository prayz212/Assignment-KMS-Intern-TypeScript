import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    employee_id: number

    @Column({
        length: 100,
        nullable: false,
        unique: true
    })
    username: string

    @Column({
        nullable: false,
        length: 255
    })
    password: string

    @Column({
        length: 255,
        nullable: false,
    })
    fullname: string
    
    @Column()
    age: number

    @Column({
        nullable: false
    })
    title: string

    @Column({
        unique: true
    })
    email: string

    @Column({
        default: false
    })
    active: boolean

    @Column()
    role: number

    constructor(id: number, username: string, password: string, fullname: string, age: number, title: string, email: string, role: number) {
        super()

        this.employee_id = id
        this.username = username
        this.password = password
        this.fullname = fullname
        this.age = age
        this.title = title
        this.email = email
        this.role = role
    }
}