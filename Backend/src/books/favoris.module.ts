import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favoris } from "./entities/favoris.entity";
import { BookEntity } from "./entities/book.entity";
import { UserEntity } from "../auth/entities/user.entity";
import { FavorisController } from "./favoris.conntroller";
import { FavorisService } from "./favoris.services";


@Module({
  imports: [TypeOrmModule.forFeature([Favoris, BookEntity, UserEntity])],
  controllers: [FavorisController],
  providers: [FavorisService],
})
export class FavorisModule {}