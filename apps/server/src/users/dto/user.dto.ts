import { ApiProperty } from '@nestjs/swagger';

export class UserResDto {
  @ApiProperty({ example: 'uuid-12345' })
  id: string;

  @ApiProperty({ example: 'John', nullable: true })
  firstName?: string;

  @ApiProperty({ example: 'Doe', nullable: true })
  lastName?: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: false })
  isEmailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  picture?: string;
  @ApiProperty({ nullable: true })
  locale?: string;
  @ApiProperty({ nullable: true })
  googleRaw?: any;

  @ApiProperty({ nullable: true })
  qazoPrayers?: any;

  /*  extra: provider ID larini qaytarmoqchi bo‘lsangiz
  @ApiProperty({ type: [String] })
  providerIds: string[];
  */

  constructor(partial: Partial<UserResDto>) {
    Object.assign(this, partial);
  }
}
