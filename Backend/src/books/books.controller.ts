import {
  Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch,
  Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/books',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `book-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async ajouterLivre(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    // Handle file upload or URL
    let imageUrl: string;
    
    if (file) {
      // File uploaded - generate full URL
      const host = req.headers['host'] || 'localhost:3000';
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      imageUrl = `${protocol}://${host}/uploads/books/${file.filename}`;
    } else if (body.image) {
      // URL provided - validate and use it
      imageUrl = body.image;
    } else {
      imageUrl = 'https://via.placeholder.com/300x400?text=No+Image';
    }

    // Prepare book data
    const bookData: CreateBookDto = {
      title: body.title,
      year: parseInt(body.year),
      editor: body.editor,
      image: imageUrl,
      category: body.category,
      author: parseInt(body.author),
    };

    let data = await this.bookSer.addBook(bookData, req["user"]["userId"]);
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