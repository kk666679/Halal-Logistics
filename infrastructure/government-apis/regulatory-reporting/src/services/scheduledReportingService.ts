import { logger } from '../utils/logger';
import * as cron from 'node-cron';

export interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  schedule: string;
  templateId?: string;
  format: string;
  recipients: string[];
  parameters: Record<string, any>;
  active: boolean;
  nextRun: Date;
  lastRun?: Date;
  runCount: number;
  successCount: number;
  failureCount: number;
}

export interface ExecutionResult {
  success: boolean;
  executionId: string;
  duration: number;
  fileSize?: number;
  errorMessage?: string;
  downloadUrl?: string;
}

export class ScheduledReportingService {
  private schedules: Map<string, ScheduledReport> = new Map();
  private runningJobs: Map<string, cron.ScheduledTask> = new Map();

  async initialize(): Promise<void> {
    logger.info('Initializing Scheduled Reporting Service');

    try {
      // Load existing schedules from database (simulated)
      await this.loadSchedules();

      // Start all active schedules
      await this.startAllSchedules();

      logger.info('✅ Scheduled Reporting Service initialized successfully', {
        totalSchedules: this.schedules.size,
        activeSchedules: Array.from(this.schedules.values()).filter(s => s.active).length
      });
    } catch (error) {
      logger.error('Failed to initialize Scheduled Reporting Service', error);
      throw error;
    }
  }

  private async loadSchedules(): Promise<void> {
    // Simulate loading schedules from database
    const mockSchedules: ScheduledReport[] = [
      {
        id: 'SCH-001',
        name: 'Daily Halal Compliance Summary',
        reportType: 'halal-compliance',
        schedule: '0 9 * * *', // Every day at 9 AM
        templateId: 'TPL-001',
        format: 'pdf',
        recipients: ['compliance@company.com', 'manager@company.com'],
        parameters: {
          includeCharts: true,
          period: 'daily'
        },
        active: true,
        nextRun: this.calculateNextRun('0 9 * * *'),
        runCount: 30,
        successCount: 28,
        failureCount: 2
      },
      {
        id: 'SCH-002',
        name: 'Weekly Food Safety Report',
        reportType: 'food-safety',
        schedule: '0 8 * * 1', // Every Monday at 8 AM
        templateId: 'TPL-002',
        format: 'excel',
        recipients: ['safety@company.com', 'qa@company.com'],
        parameters: {
          includeRawData: true,
          period: 'weekly'
        },
        active: true,
        nextRun: this.calculateNextRun('0 8 * * 1'),
        runCount: 12,
        successCount: 11,
        failureCount: 1
      },
      {
        id: 'SCH-003',
        name: 'Monthly Quality Control Report',
        reportType: 'quality-control',
        schedule: '0 10 1 * *', // First day of every month at 10 AM
        templateId: 'TPL-003',
        format: 'pdf',
        recipients: ['quality@company.com', 'management@company.com'],
        parameters: {
          includeTrends: true,
          period: 'monthly'
        },
        active: true,
        nextRun: this.calculateNextRun('0 10 1 * *'),
        runCount: 6,
        successCount: 6,
        failureCount: 0
      }
    ];

    mockSchedules.forEach(schedule => {
      this.schedules.set(schedule.id, schedule);
    });

    logger.info('Loaded schedules from database', { count: mockSchedules.length });
  }

  private async startAllSchedules(): Promise<void> {
    const activeSchedules = Array.from(this.schedules.values()).filter(s => s.active);

    for (const schedule of activeSchedules) {
      await this.startSchedule(schedule);
    }

    logger.info('Started all active schedules', { count: activeSchedules.length });
  }

  private async startSchedule(schedule: ScheduledReport): Promise<void> {
    try {
      // Stop existing job if any
      if (this.runningJobs.has(schedule.id)) {
        this.runningJobs.get(schedule.id)?.stop();
      }

      // Create new cron job
      const job = cron.schedule(schedule.schedule, async () => {
        await this.executeScheduledReport(schedule);
      }, {
        scheduled: false // Don't start immediately
      });

      // Start the job
      job.start();

      this.runningJobs.set(schedule.id, job);

      logger.info('Started scheduled report', {
        scheduleId: schedule.id,
        name: schedule.name,
        nextRun: schedule.nextRun.toISOString()
      });
    } catch (error) {
      logger.error('Failed to start schedule', { scheduleId: schedule.id, error });
    }
  }

  private async executeScheduledReport(schedule: ScheduledReport): Promise<void> {
    const executionId = `EXEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    logger.info('Executing scheduled report', {
      executionId,
      scheduleId: schedule.id,
      name: schedule.name,
      reportType: schedule.reportType
    });

    try {
      // Generate the report
      const result = await this.generateReport(schedule, executionId);

      // Update schedule statistics
      await this.updateScheduleStats(schedule.id, result.success);

      // Send notifications
      if (result.success && schedule.recipients.length > 0) {
        await this.sendNotifications(schedule, result);
      }

      const duration = Date.now() - startTime;
      logger.info('Scheduled report execution completed', {
        executionId,
        scheduleId: schedule.id,
        success: result.success,
        duration: `${duration}ms`,
        fileSize: result.fileSize ? `${result.fileSize} bytes` : 'N/A'
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Scheduled report execution failed', {
        executionId,
        scheduleId: schedule.id,
        error: (error as Error).message,
        duration: `${duration}ms`
      });

      // Update failure statistics
      await this.updateScheduleStats(schedule.id, false);
    }
  }

  private async generateReport(schedule: ScheduledReport, executionId: string): Promise<ExecutionResult> {
    // Simulate report generation process
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate occasional failures (5% failure rate)
        const shouldFail = Math.random() < 0.05;

        if (shouldFail) {
          resolve({
            success: false,
            executionId,
            duration: 30000, // 30 seconds
            errorMessage: 'Database connection timeout during report generation'
          });
        } else {
          // Simulate successful report generation
          const fileSize = Math.floor(Math.random() * 5000000) + 1000000; // 1-6 MB

          resolve({
            success: true,
            executionId,
            duration: Math.floor(Math.random() * 60000) + 30000, // 30-90 seconds
            fileSize,
            downloadUrl: `/api/v1/reports/${executionId}/download`
          });
        }
      }, 2000); // Simulate 2 second processing time
    });
  }

  private async updateScheduleStats(scheduleId: string, success: boolean): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return;

    schedule.runCount++;
    if (success) {
      schedule.successCount++;
    } else {
      schedule.failureCount++;
    }
    schedule.lastRun = new Date();

    // Calculate next run
    schedule.nextRun = this.calculateNextRun(schedule.schedule);

    // In a real implementation, this would update the database
    logger.info('Updated schedule statistics', {
      scheduleId,
      runCount: schedule.runCount,
      successCount: schedule.successCount,
      failureCount: schedule.failureCount,
      nextRun: schedule.nextRun.toISOString()
    });
  }

  private async sendNotifications(schedule: ScheduledReport, result: ExecutionResult): Promise<void> {
    // Simulate sending email notifications
    for (const recipient of schedule.recipients) {
      logger.info('Sending notification', {
        scheduleId: schedule.id,
        recipient,
        executionId: result.executionId,
        success: result.success
      });

      // In a real implementation, this would send actual emails
      // For now, just log the notification
    }
  }

  private calculateNextRun(cronExpression: string): Date {
    // This is a simplified calculation
    // In a real implementation, you'd use a proper cron parser library
    const now = new Date();
    const nextRun = new Date(now);

    // Simple logic for common patterns
    if (cronExpression.includes('1 * *')) {
      // First day of month
      nextRun.setMonth(nextRun.getMonth() + 1, 1);
      nextRun.setHours(10, 0, 0, 0);
    } else if (cronExpression.includes('* * 1')) {
      // Every Monday
      const daysUntilMonday = (1 - now.getDay() + 7) % 7;
      nextRun.setDate(now.getDate() + (daysUntilMonday || 7));
      nextRun.setHours(8, 0, 0, 0);
    } else {
      // Default: next day
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(9, 0, 0, 0);
    }

    return nextRun;
  }

  // Public methods for external API calls
  async createSchedule(scheduleData: Partial<ScheduledReport>): Promise<ScheduledReport> {
    const scheduleId = `SCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newSchedule: ScheduledReport = {
      id: scheduleId,
      name: scheduleData.name || 'Unnamed Schedule',
      reportType: scheduleData.reportType || 'halal-compliance',
      schedule: scheduleData.schedule || '0 9 * * *',
      templateId: scheduleData.templateId,
      format: scheduleData.format || 'pdf',
      recipients: scheduleData.recipients || [],
      parameters: scheduleData.parameters || {},
      active: scheduleData.active ?? true,
      nextRun: this.calculateNextRun(scheduleData.schedule || '0 9 * * *'),
      runCount: 0,
      successCount: 0,
      failureCount: 0
    };

    this.schedules.set(scheduleId, newSchedule);
    await this.startSchedule(newSchedule);

    logger.info('Created new scheduled report', { scheduleId, name: newSchedule.name });

    return newSchedule;
  }

  async updateSchedule(scheduleId: string, updates: Partial<ScheduledReport>): Promise<ScheduledReport | null> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return null;

    // Update the schedule
    Object.assign(schedule, updates);

    // Recalculate next run if schedule changed
    if (updates.schedule) {
      schedule.nextRun = this.calculateNextRun(updates.schedule);
    }

    // Restart the schedule if it's active
    if (schedule.active) {
      await this.startSchedule(schedule);
    } else {
      // Stop the schedule if it's inactive
      const job = this.runningJobs.get(scheduleId);
      if (job) {
        job.stop();
        this.runningJobs.delete(scheduleId);
      }
    }

    logger.info('Updated scheduled report', { scheduleId, updates });

    return schedule;
  }

  async deleteSchedule(scheduleId: string): Promise<boolean> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return false;

    // Stop the running job
    const job = this.runningJobs.get(scheduleId);
    if (job) {
      job.stop();
      this.runningJobs.delete(scheduleId);
    }

    // Remove from schedules
    this.schedules.delete(scheduleId);

    logger.info('Deleted scheduled report', { scheduleId, name: schedule.name });

    return true;
  }

  async getSchedule(scheduleId: string): Promise<ScheduledReport | null> {
    return this.schedules.get(scheduleId) || null;
  }

  async getAllSchedules(): Promise<ScheduledReport[]> {
    return Array.from(this.schedules.values());
  }

  async getActiveSchedules(): Promise<ScheduledReport[]> {
    return Array.from(this.schedules.values()).filter(s => s.active);
  }

  async toggleSchedule(scheduleId: string): Promise<ScheduledReport | null> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return null;

    schedule.active = !schedule.active;

    if (schedule.active) {
      await this.startSchedule(schedule);
    } else {
      const job = this.runningJobs.get(scheduleId);
      if (job) {
        job.stop();
        this.runningJobs.delete(scheduleId);
      }
    }

    logger.info('Toggled schedule status', {
      scheduleId,
      name: schedule.name,
      active: schedule.active
    });

    return schedule;
  }

  // Get service statistics
  getStatistics(): any {
    const schedules = Array.from(this.schedules.values());
    const activeSchedules = schedules.filter(s => s.active);

    return {
      totalSchedules: schedules.length,
      activeSchedules: activeSchedules.length,
      inactiveSchedules: schedules.length - activeSchedules.length,
      totalRuns: schedules.reduce((sum, s) => sum + s.runCount, 0),
      totalSuccesses: schedules.reduce((sum, s) => sum + s.successCount, 0),
      totalFailures: schedules.reduce((sum, s) => sum + s.failureCount, 0),
      successRate: schedules.length > 0 ?
        (schedules.reduce((sum, s) => sum + s.successCount, 0) / schedules.reduce((sum, s) => sum + s.runCount, 0) * 100).toFixed(2) + '%' :
        '0%'
    };
  }
}
