// src/qazo/dto/generate-qazo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

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
