import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(pdf|doc|docx|jpg|jpeg|png|txt)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() metadata: any,
  ) {
    return this.documentService.uploadDocument(file, metadata);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  getDocuments(@Query() query: any) {
    return this.documentService.getDocuments(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getDocument(@Param('id') id: string) {
    return this.documentService.getDocument(id);
  }

  @Post('process/:id')
  @UseGuards(JwtAuthGuard)
  processDocument(@Param('id') id: string, @Body() processConfig: any) {
    return this.documentService.processDocument(id, processConfig);
  }

  @Get(':id/extract')
  @UseGuards(JwtAuthGuard)
  extractDocumentData(@Param('id') id: string, @Query() options: any) {
    return this.documentService.extractDocumentData(id, options);
  }

  @Get(':id/analyze')
  @UseGuards(JwtAuthGuard)
  analyzeDocument(@Param('id') id: string, @Query() analysisType: any) {
    return this.documentService.analyzeDocument(id, analysisType);
  }

  @Post(':id/validate')
  @UseGuards(JwtAuthGuard)
  validateDocument(@Param('id') id: string, @Body() validationRules: any) {
    return this.documentService.validateDocument(id, validationRules);
  }

  @Get(':id/convert')
  @UseGuards(JwtAuthGuard)
  convertDocument(@Param('id') id: string, @Query() convertOptions: any) {
    return this.documentService.convertDocument(id, convertOptions);
  }

  @Post(':id/classify')
  @UseGuards(JwtAuthGuard)
  classifyDocument(@Param('id') id: string, @Body() classificationData: any) {
    return this.documentService.classifyDocument(id, classificationData);
  }

  @Get(':id/search')
  @UseGuards(JwtAuthGuard)
  searchInDocument(@Param('id') id: string, @Query() searchQuery: any) {
    return this.documentService.searchInDocument(id, searchQuery);
  }

  @Put(':id/metadata')
  @UseGuards(JwtAuthGuard)
  updateDocumentMetadata(@Param('id') id: string, @Body() metadata: any) {
    return this.documentService.updateDocumentMetadata(id, metadata);
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  shareDocument(@Param('id') id: string, @Body() shareConfig: any) {
    return this.documentService.shareDocument(id, shareConfig);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteDocument(@Param('id') id: string) {
    return this.documentService.deleteDocument(id);
  }

  @Get('templates/list')
  @UseGuards(JwtAuthGuard)
  getDocumentTemplates(@Query() query: any) {
    return this.documentService.getDocumentTemplates(query);
  }

  @Post('template/create')
  @UseGuards(JwtAuthGuard)
  createDocumentTemplate(@Body() templateData: any) {
    return this.documentService.createDocumentTemplate(templateData);
  }

  @Post('batch/process')
  @UseGuards(JwtAuthGuard)
  batchProcessDocuments(@Body() batchConfig: any) {
    return this.documentService.batchProcessDocuments(batchConfig);
  }

  @Get('analytics/usage')
  @UseGuards(JwtAuthGuard)
  getDocumentAnalytics(@Query() query: any) {
    return this.documentService.getDocumentAnalytics(query);
  }
}
