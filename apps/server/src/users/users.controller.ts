// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchilar ro'yxati",
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "ID bo'yicha foydalanuvchini olish" })
  @ApiParam({
    name: 'id',
    example: 'uuid-12345',
    description: 'Foydalanuvchi ID',
  })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi', type: User })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish (admin)' })
  @ApiResponse({ status: 201, description: 'Yaratildi', type: User })
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  @ApiParam({ name: 'id', example: 'uuid-12345' })
  @ApiResponse({ status: 200, description: 'Yangilandi', type: User })
  update(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Foydalanuvchini o'chirish" })
  @ApiParam({ name: 'id', example: 'uuid-12345' })
  @ApiResponse({ status: 200, description: "O'chirildi" })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
