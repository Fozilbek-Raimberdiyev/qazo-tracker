import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import {RegisterDto} from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
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

  async login(user: any) {
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
    const { id, emails, displayName } = profile;

    // UserProvider bo'yicha qidirish
    let userProvider = await this.usersService.findProviderById(id, provider);

    if (userProvider) {
      // User allaqachon mavjud
      return this.login(userProvider.user);
    }

    // Yangi user yaratish
    const email = emails?.[0]?.value;
    const [firstName, lastName] = displayName?.split(' ') || ['', ''];

    const newUser = await this.usersService.create({
      email,
      firstName,
      lastName,
      isEmailVerified: true,
    });

    // UserProvider yaratish
    await this.usersService.createProvider({
      provider,
      providerUserId: id,
      user: newUser,
      providerData: profile,
    });

    return this.login(newUser);
  }
}
