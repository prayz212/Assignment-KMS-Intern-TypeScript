import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class Book extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255
    })
    name: string;

    @Column()
    author: string;

    @Column("text")
    description: string;

    @Column()
    total_page: number;

    @Column()
    date: number;

    constructor( name: string, author: string, description: string, page: number, date: number ) {
        super();
        
        this.name = name
        this.author = author
        this.description = description
        this.total_page = page
        this.date = date
    }
}