import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('prayer_types')
export class PrayerType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  name_uz: string;
  @Column({ nullable: true })
  name_ar: string;
  @Column({ nullable: true })
  name_en: string;
  @Column({ nullable: true })
  name_ru: string;

  @Column()
  order_no: number;
  @Column({ nullable: true })
  icon: string;
}
