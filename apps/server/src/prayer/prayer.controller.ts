// src/qazo/qazo.controller.ts
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
    await this.qazoService.completePrayer(id, req.user.id);
    return { success: true };
  }
}
