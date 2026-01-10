import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrayerTypeService } from './prayerType.service';

@ApiTags('PrayerTypes')
@Controller('prayer-types')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PrayerTypeController {
  constructor(private prayerTypeService: PrayerTypeService) {}
  @Get('list')
  async getPrayerTypes() {
    return await this.prayerTypeService.getPrayerTypes();
  }
}
