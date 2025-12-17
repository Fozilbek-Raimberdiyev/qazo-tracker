// src/qazo/dto/generate-qazo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GenerateQazoDto {
  @ApiProperty({ example: '2025-01-01' })
  @IsNotEmpty()
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: '2025-01-31' })
  @IsNotEmpty()
  @IsDateString()
  toDate: string;
}
