import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

@Entity()
export class Code extends BaseEntity {

    @PrimaryColumn({
        nullable: false
    })
    code: number

    @PrimaryColumn({
        length: 255,
        nullable: false
    })
    email: string

    @Column({
        type: 'timestamp',
        nullable: false,
        default: () => "CURRENT_TIMESTAMP"
    })
    createAt: string

    constructor(email: string) {
        super()
        this.code = parseInt(Math.random().toString().substring(2,8))
        this.email = email
    }
}