// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchi emaili',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Kuchli parol (min 8 belgi)',
    required: true,
    minLength: 8,
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'Ism (ixtiyoriy)',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Familiya (ixtiyoriy)',
    required: false,
  })
  lastName?: string;
}
