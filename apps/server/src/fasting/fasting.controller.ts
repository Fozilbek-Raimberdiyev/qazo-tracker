import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastingService } from './fasting.service';
import { GenerateFastingDto } from './dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Fasting')
@Controller('fasting')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FastingController {
  constructor(private fastingService: FastingService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Qazo namozlari events yaratish' })
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

  @Get('my')
  @ApiOperation({ summary: "Mening qazo ro'zalarim" })
  @ApiParam({ name: 'year', required: false })
  async getMyPrayers(@Req() req, @Query() query: { year?: number }) {
    return this.fastingService.getUserFastings(req.user.userId, query.year);
  }
}
