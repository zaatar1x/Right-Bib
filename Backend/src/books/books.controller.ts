import {
  Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch,
  Post, Put, Query, Req,
  UseGuards

} from "@nestjs/common";
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { IsAdminGuard } from '../guards/is-admin/is-admin.guard';
import { CreateBookDto } from "../DTO/create-book.dto";


@Controller('books')
export class BooksController {
  @Inject(BooksService) bookSer: BooksService;

  @Get('/all')
  async chercherTousLesLivres(@Req() req: Request) {
    try {
      let data = await this.bookSer.getAllBooks();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Post('/new')
  async ajouterLivre(@Req() req: Request, @Body() body: CreateBookDto) {
    let data = await this.bookSer.addBook(body, req["user"]["userId"]);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search/:id')
  async chercherBook(@Param('id', ParseIntPipe) id, @Req() request) {
    return this.bookSer.getBookById(id);
  }

  @Put('/edit/:id')
  async modifierBook(
    @Body() body: CreateBookDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookSer.updateBook(id, body);
  }

  @Delete('remove/:id')
  async removeBook(@Param('id', ParseIntPipe) id) {
    return this.bookSer.removeBook(id);
  }

  @Delete('delete/:id')
  async deleteBook(@Param('id', ParseIntPipe) id) {
    return this.bookSer.deleteBook(id);
  }

  @Delete('softdelete/:id')
  async softDeleteBook(@Param('id', ParseIntPipe) id) {
    return this.bookSer.softDeleteBook(id);
  }

  @Patch('restore/:id')
  async restoreBook(@Param('id', ParseIntPipe) id) {
    return this.bookSer.restoreBook(id);
  }

  @Patch('recover/:id')
  async recoverBook(@Param('id', ParseIntPipe) id) {
    return this.bookSer.recoverBook(id);
  }

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get('stats')
  async nbreLivresParAnnee() {
    return this.bookSer.nbBooksPerYear();
  }

}