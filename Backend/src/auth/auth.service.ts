import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './generics/role.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtSer: JwtService
  ) {}

  async signUp(informations) {
    let newUserEntity = this.userRepo.create({
      email:    informations.email,
      username: informations.username,
      role:     informations.role || Roles.ROLE_USER,
      salt:     await bcrypt.genSalt()
    });

    newUserEntity.password = await bcrypt.hash(informations.password, newUserEntity.salt);

    try {
      return await this.userRepo.save(newUserEntity);
    } catch {
      throw new ConflictException();
    }
  }

  async signIn(informations) {
    let { identifiant, password } = informations;

    let user = await this.userRepo
      .createQueryBuilder('user')
      .select('user')
      .where('user.username = :ident or user.email = :ident')
      .setParameter('ident', identifiant)
      .getOne();

    if (!user) throw new NotFoundException('Identifiant inexistant');

    const resultMatching = await bcrypt.compare(password, user.password);

    if (!resultMatching) throw new NotFoundException('Mot de passe erroné');

    // JWT contient id + role pour les guards
    const token = this.jwtSer.sign({ id: user.id, role: user.role });

    // On retire password et salt de la réponse
    const { password: _p, salt: _s, ...safeUser } = user;

    return {
      ...safeUser,          // id, email, username, role
      access_token: token,
    };
  }

  async totalUsers(): Promise<{ total: number }> {
    const total = await this.userRepo.count();
    return { total };
  }
}