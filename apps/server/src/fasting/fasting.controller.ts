import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
  Put,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastingService } from './fasting.service';
import { AddSingleFastingDto, CompleteMultipleFastingsDto, GenerateFastingDto } from './dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Fasting')
@Controller('fasting')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FastingController {
  constructor(private fastingService: FastingService) {}

  @Get('export/pdf')
  @ApiOperation({ summary: "Barcha qazo ro'zalarni PDF formatida eksport qilish" })
  async exportAllFastingsToPdf(@Req() req, @Res() res: Response) {
    try {
      const pdfBuffer = await this.fastingService.generateFastingPdf(
        req.user.userId,
        {
          name: req.user.name || 'Foydalanuvchi',
          email: req.user.email || '',
        },
      );
      // @ts-expect-error
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=qazo-rozalar-${Date.now()}.pdf`,
        'Content-Length': pdfBuffer.length,
      });
      // @ts-expect-error
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      // @ts-expect-error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'PDF yaratishda xatolik yuz berdi',
        error: error.message,
      });
    }
  }

  @Post('add')
  @ApiOperation({ summary: "Bitta qazo ro'za qo'shish" })
  async addSingle(@Req() req, @Body() dto: AddSingleFastingDto) {
    return this.fastingService.addSingleFasting(req.user.userId, dto.date);
  }

  @Post('generate')
  @ApiOperation({ summary: "Qazo ro'za eventlarini yaratish" })
  async generate(@Req() req, @Body() dto: GenerateFastingDto) {
    return this.fastingService.generateFastingPrayers(
      req.user.userId,
      dto.fromYear,
      dto.toYear,
    );
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: "Qazo ro'zani bajarildi deb belgilash" })
  async complete(@Req() req, @Param('id') id: string) {
    await this.fastingService.completeFasting(id, req.user.userId);
    return { success: true };
  }

  @Put('complete')
  @ApiOperation({ summary: "Bir nechta qazo ro'zani bajarildi deb belgilash" })
  async completeMultiple(@Req() req, @Body() body: CompleteMultipleFastingsDto) {
    await this.fastingService.completeFastingsMultiple(body.fastingIds, req.user.userId);
    return { success: true };
  }

  @Put('uncomplete')
  @ApiOperation({ summary: "Bir nechta qazo ro'zani bajarilmagan qilib belgilash" })
  async uncompleteMultiple(@Req() req, @Body() body: CompleteMultipleFastingsDto) {
    await this.fastingService.uncompleteFastingsMultiple(body.fastingIds, req.user.userId);
    return { success: true };
  }

  @Get('my')
  @ApiOperation({ summary: "Mening qazo ro'zalarim" })
  @ApiParam({ name: 'year', required: false })
  async getMyPrayers(@Req() req, @Query() query: { year?: number }) {
    return this.fastingService.getUserFastings(req.user.userId, query.year);
  }
}
