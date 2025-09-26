#!/usr/bin/env node

/**
 * Risk Assessment Agent Test Script
 * Comprehensive testing suite for the Risk Assessment Agent
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class RiskAssessmentTester {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3016/api/v1';
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
    this.jwtToken = null;
  }

  /**
   * Log test result
   */
  logResult(testName, passed, error = null, response = null) {
    this.testResults.total++;
    if (passed) {
      this.testResults.passed++;
      console.log(`✅ ${testName}`);
    } else {
      this.testResults.failed++;
      console.log(`❌ ${testName}`);
      if (error) console.log(`   Error: ${error.message}`);
      if (response) console.log(`   Response: ${JSON.stringify(response, null, 2)}`);
    }

    this.testResults.tests.push({
      name: testName,
      passed,
      error: error?.message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Test health endpoint
   */
  async testHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/risk/health`);
      const passed = response.status === 200 && response.data.status === 'healthy';
      this.logResult('Health Check', passed, null, response.data);
      return passed;
    } catch (error) {
      this.logResult('Health Check', false, error);
      return false;
    }
  }

  /**
   * Test status endpoint
   */
  async testStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/risk/status`);
      const passed = response.status === 200 && response.data.status === 'operational';
      this.logResult('Status Check', passed, null, response.data);
      return passed;
    } catch (error) {
      this.logResult('Status Check', false, error);
      return false;
    }
  }

  /**
   * Test authentication
   */
  async testAuthentication() {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        username: 'test-admin',
        password: 'test-password-123'
      });

      if (response.status === 200 && response.data.access_token) {
        this.jwtToken = response.data.access_token;
        this.logResult('Authentication', true, null, { tokenReceived: true });
        return true;
      } else {
        this.logResult('Authentication', false, null, response.data);
        return false;
      }
    } catch (error) {
      this.logResult('Authentication', false, error);
      return false;
    }
  }

  /**
   * Test risk assessment
   */
  async testRiskAssessment() {
    if (!this.jwtToken) {
      this.logResult('Risk Assessment', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/risk/assess`, {
        type: 'supply_chain',
        context: {
          supplierId: 'SUP-001',
          productId: 'PROD-001',
          region: 'Southeast Asia',
          timeframe: '30d'
        },
        factors: {
          quality: 0.8,
          compliance: 0.9,
          financial: 0.7,
          operational: 0.85
        },
        parameters: {
          includeRecommendations: true,
          includeMitigation: true,
          confidenceThreshold: 0.8
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const passed = response.status === 200 &&
                    response.data.success === true &&
                    response.data.riskLevel &&
                    response.data.assessmentId;

      this.logResult('Risk Assessment', passed, null, {
        riskLevel: response.data.riskLevel,
        assessmentId: response.data.assessmentId
      });
      return passed;
    } catch (error) {
      this.logResult('Risk Assessment', false, error);
      return false;
    }
  }

  /**
   * Test batch risk assessment
   */
  async testBatchRiskAssessment() {
    if (!this.jwtToken) {
      this.logResult('Batch Risk Assessment', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/risk/batch/assess`, {
        assessments: [
          {
            type: 'supply_chain',
            context: { supplierId: 'SUP-001', productId: 'PROD-001' }
          },
          {
            type: 'compliance',
            context: { regulation: 'halal_standards', region: 'Malaysia' }
          }
        ],
        options: {
          parallel: true,
          includeRecommendations: true
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const passed = response.status === 200 &&
                    response.data.total === 2 &&
                    response.data.successful >= 0 &&
                    response.data.failed >= 0;

      this.logResult('Batch Risk Assessment', passed, null, {
        total: response.data.total,
        successful: response.data.successful,
        failed: response.data.failed
      });
      return passed;
    } catch (error) {
      this.logResult('Batch Risk Assessment', false, error);
      return false;
    }
  }

  /**
   * Test risk models endpoint
   */
  async testRiskModels() {
    if (!this.jwtToken) {
      this.logResult('Risk Models', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/risk/models?type=ml&status=active`, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });

      const passed = response.status === 200 && response.data.models !== undefined;
      this.logResult('Risk Models', passed, null, { modelsCount: response.data.models?.length || 0 });
      return passed;
    } catch (error) {
      this.logResult('Risk Models', false, error);
      return false;
    }
  }

  /**
   * Test risk factors endpoint
   */
  async testRiskFactors() {
    if (!this.jwtToken) {
      this.logResult('Risk Factors', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/risk/factors?category=operational&severity=high`, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });

      const passed = response.status === 200 && response.data.factors !== undefined;
      this.logResult('Risk Factors', passed, null, { factorsCount: response.data.factors?.length || 0 });
      return passed;
    } catch (error) {
      this.logResult('Risk Factors', false, error);
      return false;
    }
  }

  /**
   * Test risk alerts endpoint
   */
  async testRiskAlerts() {
    if (!this.jwtToken) {
      this.logResult('Risk Alerts', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/risk/alerts?status=active&priority=high`, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });

      const passed = response.status === 200 && response.data.alerts !== undefined;
      this.logResult('Risk Alerts', passed, null, { alertsCount: response.data.alerts?.length || 0 });
      return passed;
    } catch (error) {
      this.logResult('Risk Alerts', false, error);
      return false;
    }
  }

  /**
   * Test risk simulation
   */
  async testRiskSimulation() {
    if (!this.jwtToken) {
      this.logResult('Risk Simulation', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/risk/simulate`, {
        scenario: 'supplier_disruption',
        parameters: {
          disruptionDuration: '7d',
          affectedSuppliers: ['SUP-001', 'SUP-002'],
          impactLevel: 'high',
          affectedProducts: ['PROD-001', 'PROD-002']
        },
        timeframe: '30d',
        iterations: 1000
      }, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const passed = response.status === 200 &&
                    response.data.scenario === 'supplier_disruption' &&
                    response.data.simulation;

      this.logResult('Risk Simulation', passed, null, {
        scenario: response.data.scenario,
        confidence: response.data.confidence
      });
      return passed;
    } catch (error) {
      this.logResult('Risk Simulation', false, error);
      return false;
    }
  }

  /**
   * Test risk mitigation
   */
  async testRiskMitigation() {
    if (!this.jwtToken) {
      this.logResult('Risk Mitigation', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/risk/mitigation/plan`, {
        riskId: 'RISK-001',
        strategies: [
          {
            type: 'diversification',
            description: 'Diversify supplier base',
            priority: 'high',
            estimatedCost: 50000,
            implementationTime: '30d'
          }
        ],
        timeline: '90d',
        resources: ['quality_team', 'supply_chain_team']
      }, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const passed = response.status === 200 &&
                    response.data.success === true &&
                    response.data.planId;

      this.logResult('Risk Mitigation', passed, null, {
        planId: response.data.planId,
        status: response.data.status
      });
      return passed;
    } catch (error) {
      this.logResult('Risk Mitigation', false, error);
      return false;
    }
  }

  /**
   * Test risk dashboard
   */
  async testRiskDashboard() {
    if (!this.jwtToken) {
      this.logResult('Risk Dashboard', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/risk/dashboard?timeframe=30d&includeAlerts=true&includeMetrics=true`, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });

      const passed = response.status === 200 && response.data.dashboard;
      this.logResult('Risk Dashboard', passed, null, {
        hasSummary: !!response.data.dashboard?.summary,
        hasRiskDistribution: !!response.data.dashboard?.riskDistribution
      });
      return passed;
    } catch (error) {
      this.logResult('Risk Dashboard', false, error);
      return false;
    }
  }

  /**
   * Test risk KPIs
   */
  async testRiskKPIs() {
    if (!this.jwtToken) {
      this.logResult('Risk KPIs', false, new Error('No JWT token available'));
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/risk/kpi?category=overall&timeframe=30d`, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });

      const passed = response.status === 200 && response.data.kpis;
      this.logResult('Risk KPIs', passed, null, {
        kpisCount: response.data.kpis?.length || 0
      });
      return passed;
    } catch (error) {
      this.logResult('Risk KPIs', false, error);
      return false;
    }
  }

  /**
   * Test data import/export
   */
  async testDataImportExport() {
    if (!this.jwtToken) {
      this.logResult('Data Import/Export', false, new Error('No JWT token available'));
      return false;
    }

    try {
      // Test export first
      const exportResponse = await axios.get(`${this.baseUrl}/risk/export?format=json&filters={"type":"supply_chain"}&fields=risk_score,category,date`, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`
        }
      });

      const exportPassed = exportResponse.status === 200 && exportResponse.data.success === true;

      // Note: Import test would require a file upload, so we'll skip it for now
      // and just test the export functionality

      this.logResult('Data Export', exportPassed, null, {
        format: exportResponse.data.format,
        size: exportResponse.data.size
      });

      return exportPassed;
    } catch (error) {
      this.logResult('Data Export', false, error);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Starting Risk Assessment Agent Tests...\n');

    // Basic tests (no auth required)
    await this.testHealth();
    await this.testStatus();

    // Authentication test
    await this.testAuthentication();

    // Authenticated tests
    if (this.jwtToken) {
      await this.testRiskAssessment();
      await this.testBatchRiskAssessment();
      await this.testRiskModels();
      await this.testRiskFactors();
      await this.testRiskAlerts();
      await this.testRiskSimulation();
      await this.testRiskMitigation();
      await this.testRiskDashboard();
      await this.testRiskKPIs();
      await this.testDataImportExport();
    }

    this.printSummary();
    this.saveResults();
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed}`);
    console.log(`Failed: ${this.testResults.failed}`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);

    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.tests
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error || 'Unknown error'}`);
        });
    }

    console.log('='.repeat(50));
  }

  /**
   * Save test results to file
   */
  saveResults() {
    const resultsDir = path.join(__dirname, 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(resultsDir, `risk-assessment-test-${timestamp}.json`);

    fs.writeFileSync(filename, JSON.stringify(this.testResults, null, 2));
    console.log(`\n💾 Test results saved to: ${filename}`);
  }

  /**
   * Test structure validation
   */
  testStructure() {
    console.log('🔍 Validating Risk Assessment Agent Structure...\n');

    const requiredFiles = [
      'src/main.ts',
      'src/app.module.ts',
      'src/risk/risk.controller.ts',
      'src/risk/risk.service.ts',
      'src/auth/auth.service.ts',
      'src/auth/jwt.strategy.ts',
      'src/auth/jwt-auth.guard.ts',
      'src/services/message-broker.service.ts',
      'src/services/risk-analysis.service.ts',
      'src/services/risk-model.service.ts',
      'src/services/risk-reporting.service.ts',
      'src/services/metrics.service.ts',
      'package.json',
      'tsconfig.json',
      'Dockerfile',
      'docker-compose.yml',
      'test-agent.js',
      'postman/Risk_Assessment_Agent.postman_collection.json',
      '.env.example'
    ];

    let allFilesExist = true;
    requiredFiles.forEach(file => {
      const exists = fs.existsSync(file);
      console.log((exists ? '✅' : '❌') + ' ' + file);
      if (!exists) allFilesExist = false;
    });

    console.log(allFilesExist ? '\n🎉 All required files exist!' : '\n⚠️ Some files are missing');

    return allFilesExist;
  }
}

// Main execution
async function main() {
  const tester = new RiskAssessmentTester();

  // Check command line arguments
  if (process.argv.includes('--structure-only')) {
    tester.testStructure();
    return;
  }

  // Run all tests
  await tester.runAllTests();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
main().catch(console.error);
