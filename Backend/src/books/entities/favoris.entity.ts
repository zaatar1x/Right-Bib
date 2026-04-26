import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "./book.entity";
import { UserEntity } from "../../auth/entities/user.entity";

@Entity('favoris')
export class Favoris {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => BookEntity)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: BookEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}