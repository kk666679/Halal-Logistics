import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QualityService } from './quality.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Get('health')
  getHealth() {
    return this.qualityService.getHealth();
  }

  @Get('status')
  getStatus() {
    return this.qualityService.getStatus();
  }

  @Post('inspect')
  @UseGuards(JwtAuthGuard)
  inspectProduct(@Body() inspectionData: any) {
    return this.qualityService.inspectProduct(inspectionData);
  }

  @Get('inspection/:id')
  @UseGuards(JwtAuthGuard)
  getInspection(@Param('id') id: string) {
    return this.qualityService.getInspection(id);
  }

  @Get('inspections')
  @UseGuards(JwtAuthGuard)
  getInspections(@Query() query: any) {
    return this.qualityService.getInspections(query);
  }

  @Post('batch/inspect')
  @UseGuards(JwtAuthGuard)
  batchInspectProducts(@Body() batchData: any) {
    return this.qualityService.batchInspectProducts(batchData);
  }

  @Post('image/analyze')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  analyzeProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() analysisData: any,
  ) {
    return this.qualityService.analyzeProductImage(file, analysisData);
  }

  @Get('standards')
  @UseGuards(JwtAuthGuard)
  getQualityStandards(@Query() query: any) {
    return this.qualityService.getQualityStandards(query);
  }

  @Post('standard/validate')
  @UseGuards(JwtAuthGuard)
  validateAgainstStandard(@Body() validationData: any) {
    return this.qualityService.validateAgainstStandard(validationData);
  }

  @Get('defects')
  @UseGuards(JwtAuthGuard)
  getDefectTypes(@Query() query: any) {
    return this.qualityService.getDefectTypes(query);
  }

  @Post('defect/analyze')
  @UseGuards(JwtAuthGuard)
  analyzeDefect(@Body() defectData: any) {
    return this.qualityService.analyzeDefect(defectData);
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  getQualityMetrics(@Query() query: any) {
    return this.qualityService.getQualityMetrics(query);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getQualityDashboard(@Query() query: any) {
    return this.qualityService.getQualityDashboard(query);
  }

  @Get('kpi')
  @UseGuards(JwtAuthGuard)
  getQualityKPIs(@Query() query: any) {
    return this.qualityService.getQualityKPIs(query);
  }

  @Post('kpi/target')
  @UseGuards(JwtAuthGuard)
  setQualityKPITarget(@Body() kpiData: any) {
    return this.qualityService.setQualityKPITarget(kpiData);
  }

  @Get('trends')
  @UseGuards(JwtAuthGuard)
  getQualityTrends(@Query() query: any) {
    return this.qualityService.getQualityTrends(query);
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  getQualityAlerts(@Query() query: any) {
    return this.qualityService.getQualityAlerts(query);
  }

  @Post('alert/acknowledge/:id')
  @UseGuards(JwtAuthGuard)
  acknowledgeQualityAlert(@Param('id') id: string) {
    return this.qualityService.acknowledgeQualityAlert(id);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard)
  getQualityReports(@Query() query: any) {
    return this.qualityService.getQualityReports(query);
  }

  @Post('report/generate')
  @UseGuards(JwtAuthGuard)
  generateQualityReport(@Body() reportConfig: any) {
    return this.qualityService.generateQualityReport(reportConfig);
  }

  @Get('compliance')
  @UseGuards(JwtAuthGuard)
  getComplianceStatus(@Query() query: any) {
    return this.qualityService.getComplianceStatus(query);
  }

  @Post('compliance/check')
  @UseGuards(JwtAuthGuard)
  checkCompliance(@Body() complianceData: any) {
    return this.qualityService.checkCompliance(complianceData);
  }

  @Get('certifications')
  @UseGuards(JwtAuthGuard)
  getQualityCertifications(@Query() query: any) {
    return this.qualityService.getQualityCertifications(query);
  }

  @Post('certification/validate')
  @UseGuards(JwtAuthGuard)
  validateCertification(@Body() certData: any) {
    return this.qualityService.validateCertification(certData);
  }

  @Get('suppliers')
  @UseGuards(JwtAuthGuard)
  getSupplierQuality(@Query() query: any) {
    return this.qualityService.getSupplierQuality(query);
  }

  @Post('supplier/rate')
  @UseGuards(JwtAuthGuard)
  rateSupplierQuality(@Body() ratingData: any) {
    return this.qualityService.rateSupplierQuality(ratingData);
  }

  @Get('processes')
  @UseGuards(JwtAuthGuard)
  getProcessQuality(@Query() query: any) {
    return this.qualityService.getProcessQuality(query);
  }

  @Post('process/monitor')
  @UseGuards(JwtAuthGuard)
  monitorProcessQuality(@Body() processData: any) {
    return this.qualityService.monitorProcessQuality(processData);
  }

  @Get('batches')
  @UseGuards(JwtAuthGuard)
  getBatchQuality(@Query() query: any) {
    return this.qualityService.getBatchQuality(query);
  }

  @Post('batch/quality')
  @UseGuards(JwtAuthGuard)
  assessBatchQuality(@Body() batchData: any) {
    return this.qualityService.assessBatchQuality(batchData);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getQualityHistory(@Query() query: any) {
    return this.qualityService.getQualityHistory(query);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  importQualityData(
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
    return this.qualityService.importQualityData(file, importConfig);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  exportQualityData(@Query() exportConfig: any) {
    return this.qualityService.exportQualityData(exportConfig);
  }

  @Get('models')
  @UseGuards(JwtAuthGuard)
  getQualityModels(@Query() query: any) {
    return this.qualityService.getQualityModels(query);
  }

  @Post('simulate')
  @UseGuards(JwtAuthGuard)
  simulateQualityScenario(@Body() scenarioData: any) {
    return this.qualityService.simulateQualityScenario(scenarioData);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  getQualityRecommendations(@Query() query: any) {
    return this.qualityService.getQualityRecommendations(query);
  }

  @Post('recommendation/apply/:id')
  @UseGuards(JwtAuthGuard)
  applyQualityRecommendation(@Param('id') id: string, @Body() applyData: any) {
    return this.qualityService.applyQualityRecommendation(id, applyData);
  }

  // ===== ML-ENHANCED ENDPOINTS =====

  @Post('inspect/ml')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  inspectProductWithML(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() inspectionData: any,
  ) {
    return this.qualityService.inspectProductWithML(inspectionData, file?.buffer);
  }

  @Post('predict')
  @UseGuards(JwtAuthGuard)
  predictQualityIssues(@Body() predictionData: any) {
    return this.qualityService.predictQualityIssues(predictionData.productId, predictionData.horizon);
  }

  @Post('model/train')
  @UseGuards(JwtAuthGuard)
  trainQualityModel(@Body() trainingData: any) {
    return this.qualityService.trainQualityModel(trainingData);
  }

  @Get('model/metrics/:modelType')
  @UseGuards(JwtAuthGuard)
  getMLModelMetrics(@Param('modelType') modelType: string) {
    return this.qualityService.getMLModelMetrics(modelType);
  }

  @Post('assess/comprehensive')
  @UseGuards(JwtAuthGuard)
  comprehensiveQualityAssessment(@Body() assessmentData: any) {
    return this.qualityService.comprehensiveQualityAssessment(assessmentData);
  }

  @Post('monitor/start')
  @UseGuards(JwtAuthGuard)
  startRealTimeMonitoring(@Body() monitoringConfig: any) {
    return this.qualityService.startRealTimeMonitoring(monitoringConfig);
  }

  @Post('report/intelligent')
  @UseGuards(JwtAuthGuard)
  generateIntelligentQualityReport(@Body() reportConfig: any) {
    return this.qualityService.generateIntelligentQualityReport(reportConfig);
  }
}
