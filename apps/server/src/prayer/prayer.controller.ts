import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrayerService } from './prayer.service';
import { GenerateQazoDto } from './dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Prayer')
@Controller('prayer')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PrayerController {
  constructor(private qazoService: PrayerService) {}

  @Get('export/pdf')
  @ApiOperation({ summary: 'Barcha namozlarni PDF formatida eksport qilish' })
  async exportAllPrayersToPdf(@Req() req, @Res() res: Response) {
    try {
      const pdfBuffer = await this.qazoService.generatePrayerPdf(
        req.user.userId,
        {
          name: req.user.name || 'Foydalanuvchi',
          email: req.user.email || '',
        },
      );
      // @ts-expect-error
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=qazo-namozlar-${Date.now()}.pdf`,
        'Content-Length': pdfBuffer.length,
      });
      // @ts-expect-error
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      // @ts-expect-error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'PDF yaratishda xatolik yuz berdi',
        error: error.message,
      });
    }
  }
  @Post('generate')
  @ApiOperation({ summary: 'Qazo namozlari events yaratish' })
  async generate(@Req() req, @Body() dto: GenerateQazoDto) {
    return this.qazoService.generateQazoPrayers(
      req.user,
      dto.fromDate,
      dto.toDate,
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Mening qazo namozlarim' })
  async getMyPrayers(@Req() req, @Query() query: GenerateQazoDto) {
    return this.qazoService.getUserPrayers(
      req.user.userId,
      query.fromDate,
      query.toDate,
    );
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Qazo namozini bajarildi deb belgilash' })
  async complete(@Req() req, @Param('id') id: string) {
    await this.qazoService.completePrayer(id, req.user.userId);
    return { success: true };
  }
}
