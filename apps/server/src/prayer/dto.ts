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

export class CompleteMultiplePrayersDto {
  @ApiProperty({ example: ['1', '2', '3'] })
  prayerIds: string[];
}

export class AddNewPrayerDto {
  @ApiProperty({ example: '1' })
  prayerTypeId: string;

  @ApiProperty({ example: '01.01.2025' })
  date: string;
}
