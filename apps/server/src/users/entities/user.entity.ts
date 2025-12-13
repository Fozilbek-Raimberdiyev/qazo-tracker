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
  @Column({ nullable: true })
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

  @OneToMany(() => UserProvider, (provider) => provider.user, { cascade: true })
  providers: UserProvider[];
}
