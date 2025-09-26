import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboardData(@Query() query: any) {
    return this.analyticsService.getDashboardData(query);
  }

  @Get('performance')
  @UseGuards(JwtAuthGuard)
  getPerformanceMetrics(@Query() query: any) {
    return this.analyticsService.getPerformanceMetrics(query);
  }

  @Get('predictions')
  @UseGuards(JwtAuthGuard)
  getPredictions(@Query() query: any) {
    return this.analyticsService.getPredictions(query);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  getReports(@Query() query: any) {
    return this.analyticsService.getReports(query);
  }

  @Post('report/generate')
  @UseGuards(JwtAuthGuard)
  generateReport(@Body() reportConfig: any) {
    return this.analyticsService.generateReport(reportConfig);
  }

  @Get('trends')
  @UseGuards(JwtAuthGuard)
  getTrends(@Query() query: any) {
    return this.analyticsService.getTrends(query);
  }

  @Get('insights')
  @UseGuards(JwtAuthGuard)
  getInsights(@Query() query: any) {
    return this.analyticsService.getInsights(query);
  }

  @Get('kpi')
  @UseGuards(JwtAuthGuard)
  getKPIs(@Query() query: any) {
    return this.analyticsService.getKPIs(query);
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  getAlerts(@Query() query: any) {
    return this.analyticsService.getAlerts(query);
  }

  @Post('alert/configure')
  @UseGuards(JwtAuthGuard)
  configureAlert(@Body() alertConfig: any) {
    return this.analyticsService.configureAlert(alertConfig);
  }
}
