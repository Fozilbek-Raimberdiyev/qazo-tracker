// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchi emaili',
  })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Parol',
  })
  password: string;
}
