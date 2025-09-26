import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('status')
  getComplianceStatus() {
    return this.complianceService.getComplianceStatus();
  }

  @Get('regulations')
  getRegulations() {
    return this.complianceService.getRegulations();
  }

  @Get('certifications')
  getCertifications() {
    return this.complianceService.getCertifications();
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  checkCompliance(@Body() complianceData: any) {
    return this.complianceService.checkCompliance(complianceData);
  }

  @Post('report')
  @UseGuards(JwtAuthGuard)
  generateComplianceReport(@Body() reportData: any) {
    return this.complianceService.generateComplianceReport(reportData);
  }

  @Get('audit/:id')
  @UseGuards(JwtAuthGuard)
  getAuditTrail(@Param('id') id: string) {
    return this.complianceService.getAuditTrail(id);
  }
}
