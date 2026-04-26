import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BookCategory } from "../books/enum/book-category.enum";


export class CreateBookDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  editor: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsEnum(BookCategory, {
    message: `category doit être l'une des valeurs suivantes : ${Object.values(BookCategory).join(', ')}`
  })
  category: BookCategory;

  @IsNotEmpty()
  author: number;
}