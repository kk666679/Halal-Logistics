import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RiskService } from './risk.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('health')
  getHealth() {
    return this.riskService.getHealth();
  }

  @Get('status')
  getStatus() {
    return this.riskService.getStatus();
  }

  @Post('assess')
  @UseGuards(JwtAuthGuard)
  assessRisk(@Body() riskData: any) {
    return this.riskService.assessRisk(riskData);
  }

  @Get('assessment/:id')
  @UseGuards(JwtAuthGuard)
  getRiskAssessment(@Param('id') id: string) {
    return this.riskService.getRiskAssessment(id);
  }

  @Get('assessments')
  @UseGuards(JwtAuthGuard)
  getRiskAssessments(@Query() query: any) {
    return this.riskService.getRiskAssessments(query);
  }

  @Post('batch/assess')
  @UseGuards(JwtAuthGuard)
  batchAssessRisk(@Body() batchData: any) {
    return this.riskService.batchAssessRisk(batchData);
  }

  @Get('models')
  @UseGuards(JwtAuthGuard)
  getRiskModels(@Query() query: any) {
    return this.riskService.getRiskModels(query);
  }

  @Post('model/train')
  @UseGuards(JwtAuthGuard)
  trainRiskModel(@Body() trainingData: any) {
    return this.riskService.trainRiskModel(trainingData);
  }

  @Get('factors')
  @UseGuards(JwtAuthGuard)
  getRiskFactors(@Query() query: any) {
    return this.riskService.getRiskFactors(query);
  }

  @Post('factor/analyze')
  @UseGuards(JwtAuthGuard)
  analyzeRiskFactor(@Body() factorData: any) {
    return this.riskService.analyzeRiskFactor(factorData);
  }

  @Get('thresholds')
  @UseGuards(JwtAuthGuard)
  getRiskThresholds(@Query() query: any) {
    return this.riskService.getRiskThresholds(query);
  }

  @Put('thresholds')
  @UseGuards(JwtAuthGuard)
  updateRiskThresholds(@Body() thresholds: any) {
    return this.riskService.updateRiskThresholds(thresholds);
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  getRiskAlerts(@Query() query: any) {
    return this.riskService.getRiskAlerts(query);
  }

  @Post('alert/acknowledge/:id')
  @UseGuards(JwtAuthGuard)
  acknowledgeRiskAlert(@Param('id') id: string) {
    return this.riskService.acknowledgeRiskAlert(id);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  getRiskReports(@Query() query: any) {
    return this.riskService.getRiskReports(query);
  }

  @Post('report/generate')
  @UseGuards(JwtAuthGuard)
  generateRiskReport(@Body() reportConfig: any) {
    return this.riskService.generateRiskReport(reportConfig);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  getRiskAnalytics(@Query() query: any) {
    return this.riskService.getRiskAnalytics(query);
  }

  @Get('trends')
  @UseGuards(JwtAuthGuard)
  getRiskTrends(@Query() query: any) {
    return this.riskService.getRiskTrends(query);
  }

  @Post('simulate')
  @UseGuards(JwtAuthGuard)
  simulateRiskScenario(@Body() scenarioData: any) {
    return this.riskService.simulateRiskScenario(scenarioData);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  getRiskRecommendations(@Query() query: any) {
    return this.riskService.getRiskRecommendations(query);
  }

  @Post('recommendation/apply/:id')
  @UseGuards(JwtAuthGuard)
  applyRiskRecommendation(@Param('id') id: string, @Body() applyData: any) {
    return this.riskService.applyRiskRecommendation(id, applyData);
  }

  @Get('compliance')
  @UseGuards(JwtAuthGuard)
  getComplianceRisks(@Query() query: any) {
    return this.riskService.getComplianceRisks(query);
  }

  @Get('operational')
  @UseGuards(JwtAuthGuard)
  getOperationalRisks(@Query() query: any) {
    return this.riskService.getOperationalRisks(query);
  }

  @Get('financial')
  @UseGuards(JwtAuthGuard)
  getFinancialRisks(@Query() query: any) {
    return this.riskService.getFinancialRisks(query);
  }

  @Get('supply-chain')
  @UseGuards(JwtAuthGuard)
  getSupplyChainRisks(@Query() query: any) {
    return this.riskService.getSupplyChainRisks(query);
  }

  @Get('reputation')
  @UseGuards(JwtAuthGuard)
  getReputationRisks(@Query() query: any) {
    return this.riskService.getReputationRisks(query);
  }

  @Post('mitigation/plan')
  @UseGuards(JwtAuthGuard)
  createMitigationPlan(@Body() mitigationData: any) {
    return this.riskService.createMitigationPlan(mitigationData);
  }

  @Get('mitigation/plans')
  @UseGuards(JwtAuthGuard)
  getMitigationPlans(@Query() query: any) {
    return this.riskService.getMitigationPlans(query);
  }

  @Put('mitigation/plan/:id')
  @UseGuards(JwtAuthGuard)
  updateMitigationPlan(@Param('id') id: string, @Body() updateData: any) {
    return this.riskService.updateMitigationPlan(id, updateData);
  }

  @Post('mitigation/plan/:id/execute')
  @UseGuards(JwtAuthGuard)
  executeMitigationPlan(@Param('id') id: string, @Body() executionData: any) {
    return this.riskService.executeMitigationPlan(id, executionData);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getRiskDashboard(@Query() query: any) {
    return this.riskService.getRiskDashboard(query);
  }

  @Get('kpi')
  @UseGuards(JwtAuthGuard)
  getRiskKPIs(@Query() query: any) {
    return this.riskService.getRiskKPIs(query);
  }

  @Post('kpi/target')
  @UseGuards(JwtAuthGuard)
  setRiskKPITarget(@Body() kpiData: any) {
    return this.riskService.setRiskKPITarget(kpiData);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getRiskHistory(@Query() query: any) {
    return this.riskService.getRiskHistory(query);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  importRiskData(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(csv|json|xlsx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() importConfig: any,
  ) {
    return this.riskService.importRiskData(file, importConfig);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  exportRiskData(@Query() exportConfig: any) {
    return this.riskService.exportRiskData(exportConfig);
  }
}
