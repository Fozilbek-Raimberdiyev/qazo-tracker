import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepo: Repository<Note>,
  ) {}

  async getUserNotes(userId: string): Promise<Note[]> {
    return this.notesRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      select: ['id', 'title', 'content', 'userId', 'createdAt', 'updatedAt'],
    });
  }

  async create(userId: string, dto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepo.create({
      title: dto.title,
      content: dto.content ?? '',
      userId,
    });
    return this.notesRepo.save(note);
  }

  async update(id: string, userId: string, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.notesRepo.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Qayd topilmadi');
    if (note.userId !== userId) throw new ForbiddenException("Ushbu qaydni o'zgartirish uchun ruxsat yo'q");

    if (dto.title !== undefined) note.title = dto.title;
    if (dto.content !== undefined) note.content = dto.content;

    return this.notesRepo.save(note);
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.notesRepo.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Qayd topilmadi');
    if (note.userId !== userId) throw new ForbiddenException("Ushbu qaydni o'chirish uchun ruxsat yo'q");

    await this.notesRepo.remove(note);
  }
}
