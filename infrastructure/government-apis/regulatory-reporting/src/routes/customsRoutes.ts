import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();

// Royal Malaysian Customs Department Integration Configuration
const CUSTOMS_CONFIG = {
  baseUrl: process.env.CUSTOMS_API_BASE_URL || 'https://api.customs.gov.my',
  apiKey: process.env.CUSTOMS_API_KEY,
  timeout: 30000,
  version: 'v1'
};

// Customs Declaration Interface
interface CustomsDeclaration {
  declarationId: string;
  declarationType: 'import' | 'export' | 'transit';
  declarationNumber: string;
  declarationDate: string;
  consignment: {
    consignor: {
      name: string;
      address: string;
      taxId: string;
      countryCode: string;
    };
    consignee: {
      name: string;
      address: string;
      taxId: string;
      countryCode: string;
    };
    goods: Array<{
      itemNumber: number;
      hsCode: string;
      description: string;
      quantity: number;
      unit: string;
      grossWeight: number;
      netWeight: number;
      value: number;
      currency: string;
      originCountry: string;
    }>;
  };
  transport: {
    mode: 'sea' | 'air' | 'land' | 'rail';
    vesselFlightNumber?: string;
    voyageNumber?: string;
    containerNumbers?: string[];
  };
  documents: Array<{
    type: string;
    reference: string;
    issueDate: string;
    expiryDate?: string;
  }>;
  halalCertificate?: {
    certificateNumber: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    status: 'valid' | 'expired' | 'pending';
  };
}

// Submit customs declaration
router.post('/declaration', async (req: Request, res: Response): Promise<void> => {
  try {
    const declarationData: CustomsDeclaration = req.body;

    logger.info('Customs declaration submission requested', {
      declarationType: declarationData.declarationType,
      declarationNumber: declarationData.declarationNumber,
      userId: (req as any).user?.id
    });

    // Validate declaration data
    if (!declarationData.declarationNumber || !declarationData.consignment) {
      res.status(400).json({
        success: false,
        error: 'Declaration number and consignment details are required'
      });
      return;
    }

    // Validate halal certificate for food products
    if (declarationData.consignment.goods.some(good =>
      good.hsCode.startsWith('02') || good.hsCode.startsWith('16') || good.hsCode.startsWith('19')
    )) {
      if (!declarationData.halalCertificate) {
        res.status(400).json({
          success: false,
          error: 'Halal certificate required for food products'
        });
        return;
      }

      // Verify halal certificate
      const certificateValid = await verifyHalalCertificate(declarationData.halalCertificate);
      if (!certificateValid) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired halal certificate'
        });
        return;
      }
    }

    // Submit to Royal Malaysian Customs API
    const submissionResult = await submitToCustomsAPI(declarationData);

    const response = {
      success: true,
      message: 'Customs declaration submitted successfully',
      declarationId: declarationData.declarationId,
      customsReference: submissionResult.reference,
      status: submissionResult.status,
      submittedAt: new Date().toISOString(),
      processingDetails: {
        estimatedProcessingTime: '2-4 hours',
        nextSteps: [
          'Declaration validation by customs',
          'Risk assessment',
          'Document verification',
          'Physical inspection (if required)',
          'Release approval'
        ]
      }
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Customs declaration submission error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit customs declaration'
    });
  }
});

// Get customs declaration status
router.get('/declaration/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    logger.info('Customs declaration status check requested', { declarationId: id });

    // Query Royal Malaysian Customs API for status
    const statusResult = await getCustomsDeclarationStatus(id);

    const response = {
      success: true,
      declarationId: id,
      status: statusResult.status,
      statusDescription: statusResult.description,
      lastUpdated: statusResult.lastUpdated,
      timeline: statusResult.timeline,
      documents: statusResult.documents,
      nextActions: statusResult.nextActions,
      estimatedCompletion: statusResult.estimatedCompletion
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Customs declaration status check error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customs declaration status'
    });
  }
});

// Get customs clearance requirements
router.get('/requirements/:hsCode', async (req: Request, res: Response) => {
  try {
    const { hsCode } = req.params;
    const { countryCode, declarationType } = req.query;

    logger.info('Customs requirements check requested', {
      hsCode,
      countryCode,
      declarationType
    });

    // Query Royal Malaysian Customs API for requirements
    const requirements = await getCustomsRequirements(hsCode, countryCode as string, declarationType as string);

    const response = {
      success: true,
      hsCode,
      countryCode,
      declarationType,
      requirements: {
        documents: requirements.documents,
        permits: requirements.permits,
        inspections: requirements.inspections,
        duties: requirements.duties,
        restrictions: requirements.restrictions,
        halalRequirements: requirements.halalRequirements
      },
      processingTime: requirements.processingTime,
      cost: requirements.cost,
      validityPeriod: requirements.validityPeriod
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Customs requirements check error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customs requirements'
    });
  }
});

// Generate customs compliance report
router.post('/compliance-report', async (req: Request, res: Response) => {
  try {
    const {
      period,
      entityType = 'company',
      entityId,
      includeDetails = true
    } = req.body;

    logger.info('Customs compliance report requested', {
      period,
      entityType,
      entityId,
      userId: (req as any).user?.id
    });

    // Generate comprehensive customs compliance report
    const report = await generateCustomsComplianceReport(period, entityType, entityId, includeDetails);

    const response = {
      success: true,
      reportId: report.reportId,
      period,
      entityType,
      entityId,
      generatedAt: new Date().toISOString(),
      summary: report.summary,
      compliance: report.compliance,
      declarations: report.declarations,
      violations: report.violations,
      recommendations: report.recommendations,
      downloadUrl: `/api/v1/customs/reports/${report.reportId}/download`
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Customs compliance report generation error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate customs compliance report'
    });
  }
});

// Get customs statistics
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const {
      period = '30d',
      entityType = 'company',
      entityId
    } = req.query;

    logger.info('Customs statistics requested', {
      period,
      entityType,
      entityId
    });

    // Get customs statistics from Royal Malaysian Customs API
    const statistics = await getCustomsStatistics(period as string, entityType as string, entityId as string);

    const response = {
      success: true,
      period,
      entityType,
      entityId,
      generatedAt: new Date().toISOString(),
      summary: statistics.summary,
      declarations: statistics.declarations,
      compliance: statistics.compliance,
      costs: statistics.costs,
      trends: statistics.trends,
      benchmarks: statistics.benchmarks
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Customs statistics retrieval error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customs statistics'
    });
  }
});

// Helper functions for Royal Malaysian Customs integration
async function submitToCustomsAPI(declaration: CustomsDeclaration): Promise<any> {
  try {
    const response = await axios.post(
      `${CUSTOMS_CONFIG.baseUrl}/${CUSTOMS_CONFIG.version}/declarations`,
      declaration,
      {
        headers: {
          'Authorization': `Bearer ${CUSTOMS_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Version': CUSTOMS_CONFIG.version
        },
        timeout: CUSTOMS_CONFIG.timeout
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Customs API submission error', error);
    throw new Error('Failed to submit declaration to customs API');
  }
}

async function getCustomsDeclarationStatus(declarationId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${CUSTOMS_CONFIG.baseUrl}/${CUSTOMS_CONFIG.version}/declarations/${declarationId}/status`,
      {
        headers: {
          'Authorization': `Bearer ${CUSTOMS_CONFIG.apiKey}`,
          'X-API-Version': CUSTOMS_CONFIG.version
        },
        timeout: CUSTOMS_CONFIG.timeout
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Customs API status check error', error);
    throw new Error('Failed to retrieve declaration status from customs API');
  }
}

async function getCustomsRequirements(hsCode: string, countryCode: string, declarationType: string): Promise<any> {
  try {
    const response = await axios.get(
      `${CUSTOMS_CONFIG.baseUrl}/${CUSTOMS_CONFIG.version}/requirements`,
      {
        params: { hsCode, countryCode, declarationType },
        headers: {
          'Authorization': `Bearer ${CUSTOMS_CONFIG.apiKey}`,
          'X-API-Version': CUSTOMS_CONFIG.version
        },
        timeout: CUSTOMS_CONFIG.timeout
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Customs API requirements check error', error);
    throw new Error('Failed to retrieve customs requirements');
  }
}

async function verifyHalalCertificate(certificate: any): Promise<boolean> {
  try {
    // Verify halal certificate with JAKIM (Malaysian Islamic Development Department)
    const response = await axios.post(
      `${process.env.JAKIM_API_URL || 'https://api.halal.gov.my'}/verify`,
      {
        certificateNumber: certificate.certificateNumber,
        issuer: certificate.issuer
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.JAKIM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return response.data.valid && new Date(certificate.expiryDate) > new Date();
  } catch (error) {
    logger.error('Halal certificate verification error', error);
    return false;
  }
}

async function generateCustomsComplianceReport(
  period: string,
  entityType: string,
  entityId: string,
  includeDetails: boolean
): Promise<any> {
  // Simulate customs compliance report generation
  const reportId = `CUST-RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    reportId,
    summary: {
      totalDeclarations: 45,
      compliantDeclarations: 42,
      nonCompliantDeclarations: 3,
      complianceRate: 93.3,
      totalValue: 1250000,
      totalDuties: 87500
    },
    compliance: {
      overallScore: 93.3,
      grade: 'A',
      status: 'COMPLIANT',
      standards: [
        { name: 'Documentation', score: 95, status: 'COMPLIANT' },
        { name: 'Classification', score: 92, status: 'COMPLIANT' },
        { name: 'Valuation', score: 94, status: 'COMPLIANT' },
        { name: 'Halal Compliance', score: 91, status: 'COMPLIANT' }
      ]
    },
    declarations: includeDetails ? [
      // Detailed declaration data would be included here
    ] : [],
    violations: [
      {
        id: 'VIO-CUST-001',
        type: 'DOCUMENTATION',
        description: 'Missing commercial invoice for declaration CUST-2024-001',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        date: '2024-01-15'
      }
    ],
    recommendations: [
      {
        priority: 'HIGH',
        category: 'PROCESS',
        recommendation: 'Implement automated document validation',
        benefits: 'Reduce documentation errors, faster processing',
        timeline: '2-3 months'
      }
    ]
  };
}

async function getCustomsStatistics(period: string, entityType: string, entityId: string): Promise<any> {
  // Simulate customs statistics retrieval
  return {
    summary: {
      totalDeclarations: 156,
      totalValue: 4500000,
      totalDuties: 315000,
      averageProcessingTime: '2.3 hours',
      complianceRate: 94.2
    },
    declarations: {
      byType: {
        import: { count: 89, value: 2800000, percentage: 57 },
        export: { count: 45, value: 1200000, percentage: 29 },
        transit: { count: 22, value: 500000, percentage: 14 }
      },
      byMonth: [
        { month: '2024-01', count: 45, value: 1200000 },
        { month: '2023-12', count: 52, value: 1500000 },
        { month: '2023-11', count: 38, value: 1100000 }
      ]
    },
    compliance: {
      overall: 94.2,
      byCategory: {
        documentation: 96.1,
        classification: 93.8,
        valuation: 94.5,
        halal: 92.3
      }
    },
    costs: {
      totalDuties: 315000,
      totalFees: 4500,
      totalPenalties: 1200,
      averageCostPerDeclaration: 2025
    },
    trends: {
      declarationVolume: '+12%',
      complianceRate: '+2.1%',
      processingTime: '-15%',
      averageValue: '+8%'
    },
    benchmarks: {
      industryAverage: {
        complianceRate: 91.5,
        processingTime: '2.8 hours',
        costPerDeclaration: 2150
      },
      topPerformers: {
        complianceRate: 97.2,
        processingTime: '1.9 hours',
        costPerDeclaration: 1850
      }
    }
  };
}

export { router as customsRoutes };
