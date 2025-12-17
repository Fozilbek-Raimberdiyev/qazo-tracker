// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { toUserResDto } from 'src/users/mappers/user-mapper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: "Yangi foydalanuvchi ro'yxatdan o'tish" })
  @ApiResponse({
    status: 201,
    description: "Muvaffaqiyatli ro'yxatdan o'tish",
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ma'lumot" })
  @ApiResponse({ status: 409, description: 'Email allaqachon mavjud' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish (email/password)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli kirish',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: "Noto'g'ri email yoki parol" })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('google')
  @ApiOperation({
    summary: 'Google orqali kirish (OAuth2)',
    description: "Google ga yo'naladi va OAuth2 jarayonini boshlaydi",
  })
  @ApiResponse({ status: 302, description: 'Google ga redirect' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Avtomatik redirect
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google qayta chaqiruv URL',
    description: "Google dan qaytgan so'rovdan keyin token qaytaradi",
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli auth',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req, @Res() res) {
    const jwt = req.user; // { accessToken: 'xxx' }
    return res.redirect(
      `http://localhost:5173/oauth/success?token=${jwt.accessToken}`,
    );
  }

  @Get('profile')
  @ApiOperation({ summary: 'Joriy foydalanuvchi profili' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Profil ma'lumotlari" })
  @ApiResponse({ status: 401, description: "Token yo'q yoki yaroqsiz" })
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    } else {
      return toUserResDto(user);
    }
  }
}
