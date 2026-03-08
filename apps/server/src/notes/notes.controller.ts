import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@ApiTags('Notes')
@Controller('notes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('my')
  @ApiOperation({ summary: 'Foydalanuvchining barcha qaydlarini olish' })
  getMyNotes(@Req() req) {
    return this.notesService.getUserNotes(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi qayd yaratish' })
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Qaydni tahrirlash' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Qaydni o'chirish" })
  remove(@Req() req, @Param('id') id: string) {
    return this.notesService.remove(id, req.user.userId);
  }
}
