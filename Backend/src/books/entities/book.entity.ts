import { TimeStampISIDS } from "../shared/timestamp";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthorEntity } from "./author.entity";
import { UserEntity } from "../../auth/entities/user.entity";
import { BookCategory } from "../enum/book-category.enum";


@Entity('livre')
export class BookEntity extends TimeStampISIDS {

    @PrimaryGeneratedColumn()
    id;

    @Column({ length: 50 })
    title: string;

    @Column()
    year: number;

    @Column({ type: "varchar" })
    editor;

    @Column()
    image: string;

    @Column({
        type: 'enum',
        enum: BookCategory,
        nullable: true,
        default: null
    })
    category: BookCategory;
    @ManyToOne(type => AuthorEntity, author => author.id, {
        // eager : true
    })
    author;

    @ManyToOne(type => UserEntity, (user: UserEntity) => user.id)
    user;
}