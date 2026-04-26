import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoris } from "./entities/favoris.entity";


@Injectable()
export class FavorisService {
  constructor(
    @InjectRepository(Favoris)
    private favorisRepo: Repository<Favoris>,
  ) {}

  async add(userId: number, bookId: number) {
    const exists = await this.favorisRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } }
    })
    if (exists) throw new ConflictException('Already in favorites')

    await this.favorisRepo
      .createQueryBuilder()
      .insert()
      .into(Favoris)
      .values({
        user: { id: userId } as any,
        book: { id: bookId } as any
      })
      .execute()

    return { message: 'Added to favorites' }
  }

  async remove(userId: number, bookId: number) {
    await this.favorisRepo.delete({
      user: { id: userId } as any,
      book: { id: bookId } as any
    })
  }

  async findByUser(userId: number) {
    return this.favorisRepo.find({
      where: { user: { id: userId } },
      relations: ['book', 'book.author']
    })
  }

  async totalFavoris(): Promise<{ total: number }> {
    const total = await this.favorisRepo.count();
    return { total };
  }

  async mostFavouritedBooks(limit = 10) {
    const results = await this.favorisRepo
      .createQueryBuilder('fav')
      .select('fav.book_id', 'bookId')
      .addSelect('book.title', 'title')
      .addSelect('book.image', 'image')
      .addSelect('author.prenom', 'authorFirstName')
      .addSelect('author.nom', 'authorLastName')
      .addSelect('COUNT(fav.id)', 'count')
      .innerJoin('fav.book', 'book')
      .innerJoin('book.author', 'author')
      .groupBy('fav.book_id')
      .addGroupBy('book.title')
      .addGroupBy('book.image')
      .addGroupBy('author.prenom')
      .addGroupBy('author.nom')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map(r => ({
      bookId: +r.bookId,
      title: r.title,
      image: r.image,
      authorName: `${r.authorFirstName} ${r.authorLastName}`,
      count: +r.count,
    }));
  }
}