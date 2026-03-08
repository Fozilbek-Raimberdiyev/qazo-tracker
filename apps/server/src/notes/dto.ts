import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Mening qaydim' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: '<p>Qayd matni...</p>' })
  @IsOptional()
  @IsString()
  @MaxLength(100000)
  content?: string;
}

export class UpdateNoteDto {
  @ApiPropertyOptional({ example: 'Yangilangan sarlavha' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: '<p>Yangilangan matn...</p>' })
  @IsOptional()
  @IsString()
  @MaxLength(100000)
  content?: string;
}
