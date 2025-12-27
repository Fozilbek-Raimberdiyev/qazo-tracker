import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StatisticService } from './statistic.service';

@ApiTags('Statistic')
@Controller('statistic')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Get('prayers-count')
  getPrayersCount(@Req() request): Promise<any> {
    return this.statisticService.getPrayersCount(request.user.userId);
  }

  @Get('fastings-count')
  getFastingsCount(): [] {
    return [];
  }

  @Get('prayers-count-per-year')
  getPrayersCountPerYear(@Req() request): Promise<any> {
    return this.statisticService.getPrayersCountPerYear(request.user.userId);
  }

  @Get('prayers-count-by-prayer-types')
  getPrayersCountByPrayerTypes(@Req() request): Promise<any> {
    return this.statisticService.getPrayersCountByPrayerTypes(
      request.user.userId,
    );
  }
  @Get('prayers-count-monthly-completed-by-year')
  @ApiQuery({ name: 'year', required: true })
  getMonthlyCompletedPrayersByYear(
    @Req() request,
    @Query() query
  ): Promise<any> {
    return this.statisticService.getMonthlyCompletedPrayersByYear(
      request.user.userId,
      query.year,
    );
  }
}
