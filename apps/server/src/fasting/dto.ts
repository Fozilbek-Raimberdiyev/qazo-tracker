// src/qazo/dto/generate-qazo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GenerateFastingDto {
  @ApiProperty({ example: 2025 })
  @IsNotEmpty()
  @IsDateString()
  fromYear: number;

  @ApiProperty({ example: 2025 })
  @IsNotEmpty()
  @IsDateString()
  toYear: number;
}

export class AddSingleFastingDto {
  @ApiProperty({ example: '2024-03-20', description: "Ro'za tutilgan sana (YYYY-MM-DD)" })
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

export class CompleteMultipleFastingsDto {
  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  fastingIds: string[];
}
