// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserProvider } from './user-provider.entity';
import { QazoPrayer } from 'src/prayer/entities/prayer.entity';
import { QazoFasting } from 'src/fasting/entities/fasting.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-12345', description: 'Foydalanuvchi ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John', description: 'Ism', nullable: true })
  @Column({ length: 100, nullable: true })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Familiya', nullable: true })
  @Column({ length: 100, nullable: true })
  lastName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty({ description: 'Hashlangan parol', writeOnly: true })
  @Column({ nullable: true, select: false })
  password: string;

  @ApiProperty({ example: false, description: 'Email tasdiqlanganmi' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Yaratilgan vaqt' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Yangilangan vaqt' })
  @UpdateDateColumn()
  updatedAt: Date;
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  picture?: string; // profil rasmi URL

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  locale?: string; // en, ru, uz ...
  @ApiProperty({ nullable: true })
  @Column({ type: 'jsonb', nullable: true }) // qolgan hamma narsa
  googleRaw?: any;

  @ApiProperty({ type: () => [UserProvider] })
  @OneToMany(() => UserProvider, (provider) => provider.user, { cascade: true })
  providers: UserProvider[];
  @ApiProperty({ type: () => [QazoPrayer] })
  @OneToMany(() => QazoPrayer, (prayer) => prayer.user, { cascade: true })
  qazoPrayers: QazoPrayer[];
  // fasting
  @ApiProperty({ type: () => [QazoFasting] })
  @OneToMany(() => QazoFasting, (fasting) => fasting.user, { cascade: true })
  qazoFastings: QazoFasting[];

}
