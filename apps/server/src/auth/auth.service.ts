import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // const user = await this.usersService.findByEmail(email);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    // User yaratish
    const user = await this.usersService.create(registerDto);

    // JWT token qaytarish
    return this.login(user);
  }

  async validateOAuthLogin(profile: any, provider: string) {
    const { id, emails, displayName, photos, _json } = profile;
    const email = emails?.[0]?.value;

    // 1. Provider bo‘yicha qidirish
    let userProvider = await this.usersService.findProviderById(id, provider);
    if (userProvider) return this.login(userProvider.user);

    // 2. Email allaqachon mavjudmi?
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      // 2.a Yangi user
      const [firstName, lastName] = displayName?.split(' ') || ['', ''];
      user = await this.usersService.create({
        email,
        firstName,
        lastName,
        isEmailVerified: true,
        picture: photos?.[0]?.value,
        locale: _json.locale,
        googleRaw: _json,
      });
    }

    // 3. Provider yozuvi (ya’ni userga biriktirish)
    await this.usersService.createProvider({
      provider,
      providerUserId: id,
      user,
      providerData: profile,
    });

    return this.login(user);
  }
}
