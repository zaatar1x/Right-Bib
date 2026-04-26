import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthGuard } from '@nestjs/passport';
import { FavorisService } from "./favoris.services";
import { JwtAuthGuard } from "../guards/jwt-auth/jwt-auth.guard";
import { IsAdminGuard } from "../guards/is-admin/is-admin.guard";

@Controller('favoris')
@UseGuards(AuthGuard('jwt'))
export class FavorisController {
  constructor(private favorisService: FavorisService) {}

  @Post(':bookId')
  add(@Param('bookId') bookId: number, @Req() req) {
    return this.favorisService.add(+req.user.userId, +bookId)  // ← userId
  }

  @Delete(':bookId')
  remove(@Param('bookId') bookId: number, @Req() req) {
    return this.favorisService.remove(+req.user.userId, +bookId)  // ← userId
  }

  @Get()
  findAll(@Req() req) {
    return this.favorisService.findByUser(+req.user.userId)  // ← userId
  }

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get('stats/total')
  totalFavoris() {
    return this.favorisService.totalFavoris();
  }

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get('stats/most-favourited')
  mostFavourited(@Query('limit') limit?: string) {
    return this.favorisService.mostFavouritedBooks(limit ? +limit : 10);
  }
}