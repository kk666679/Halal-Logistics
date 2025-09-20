import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto, UpdateCertificationDto, UpdateCertificationStatusDto } from './dto/certification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CertificationStatus, CertificationType } from './certification.schema';

@Controller('certifications')
@UseGuards(JwtAuthGuard)
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  async create(@Body() createCertificationDto: CreateCertificationDto, @Request() req) {
    return this.certificationService.create(createCertificationDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('status') status?: CertificationStatus) {
    if (status) {
      return this.certificationService.findByStatus(status);
    }
    return this.certificationService.findAll();
  }

  @Get('my-applications')
  async findMyApplications(@Request() req) {
    return this.certificationService.findByUser(req.user.userId);
  }

  @Get('stats')
  async getStats() {
    return this.certificationService.getCertificationStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.certificationService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCertificationDto: UpdateCertificationDto) {
    return this.certificationService.update(id, updateCertificationDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateCertificationStatusDto,
  ) {
    return this.certificationService.updateStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.reviewComments,
      undefined, // assignedTo - would need to be passed separately
      updateStatusDto.certificationNumber,
      updateStatusDto.validUntil ? new Date(updateStatusDto.validUntil) : undefined,
    );
  }

  @Patch(':id/assign')
  async assignToReviewer(@Param('id') id: string, @Body() body: { reviewerId: string }) {
    return this.certificationService.assignToReviewer(id, body.reviewerId);
  }
}
