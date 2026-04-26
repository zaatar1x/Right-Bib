import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { JwtAuthGuard } from "../guards/jwt-auth/jwt-auth.guard";
import { IsAdminGuard } from "../guards/is-admin/is-admin.guard";

@Controller('auth')
export class AuthController {
    
    constructor(private authSer : AuthService) {
        
    }
    
    @Post('signup')
    inscription(@Body() body) {
       return this.authSer.signUp(body);
    }
    
    @Post('signin')
    seConnecter(@Body() body) {
       return this.authSer.signIn(body);
    }
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get('stats/total-users')
  totalUsers() {
    return this.authSer.totalUsers();
  }
}
