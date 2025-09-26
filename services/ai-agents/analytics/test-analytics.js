#!/usr/bin/env node

/**
 * Analytics Agent Test Script
 * Tests all API endpoints and functionality
 */

const axios = require('axios');
const colors = require('colors');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3014/api/v1';
const TEST_USER = {
  username: 'test-admin',
  password: 'test-password-123'
};

let authToken = null;

class AnalyticsTester {
  constructor() {
    this.baseURL = BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async authenticate() {
    console.log('\n🔐 Authenticating...'.cyan);

    try {
      const response = await this.client.post('/auth/login', TEST_USER);

      if (response.data.access_token) {
        authToken = response.data.access_token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        console.log('✅ Authentication successful'.green);
        return true;
      }
    } catch (error) {
      console.log('❌ Authentication failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testHealthEndpoint() {
    console.log('\n🏥 Testing Health Endpoint...'.cyan);

    try {
      const response = await this.client.get('/analytics/health');
      console.log('✅ Health check passed'.green, response.data);
      return true;
    } catch (error) {
      console.log('❌ Health check failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDashboard() {
    console.log('\n📊 Testing Dashboard Data...'.cyan);

    try {
      const response = await this.client.get('/analytics/dashboard', {
        params: { period: '7d' }
      });

      console.log('✅ Dashboard data retrieved'.green);
      console.log('📈 Summary:', response.data.summary);
      console.log('🤖 Agents:', response.data.agentMetrics?.length || 0);
      return true;
    } catch (error) {
      console.log('❌ Dashboard test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testPerformanceMetrics() {
    console.log('\n⚡ Testing Performance Metrics...'.cyan);

    try {
      const response = await this.client.get('/analytics/performance', {
        params: { period: '24h', metricType: 'all' }
      });

      console.log('✅ Performance metrics retrieved'.green);
      console.log('📊 Data points:', response.data.data?.length || 0);
      console.log('📈 Summary:', response.data.summary);
      return true;
    } catch (error) {
      console.log('❌ Performance metrics test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testPredictions() {
    console.log('\n🔮 Testing Predictions...'.cyan);

    try {
      const response = await this.client.get('/analytics/predictions', {
        params: { period: '7d', type: 'demand' }
      });

      console.log('✅ Predictions retrieved'.green);
      console.log('🎯 Type:', response.data.type);
      console.log('📊 Predictions count:', response.data.predictions?.length || 0);
      console.log('🎚️ Confidence:', response.data.confidence);
      return true;
    } catch (error) {
      console.log('❌ Predictions test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testReports() {
    console.log('\n📋 Testing Reports...'.cyan);

    try {
      const response = await this.client.get('/analytics/reports', {
        params: { type: 'all', period: '30d' }
      });

      console.log('✅ Reports retrieved'.green);
      console.log('📄 Reports count:', response.data.reports?.length || 0);
      console.log('📊 Total:', response.data.total);
      return true;
    } catch (error) {
      console.log('❌ Reports test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testReportGeneration() {
    console.log('\n📝 Testing Report Generation...'.cyan);

    try {
      const reportConfig = {
        type: 'performance',
        period: '7d',
        format: 'json',
        includeCharts: true
      };

      const response = await this.client.post('/analytics/report/generate', reportConfig);

      console.log('✅ Report generation initiated'.green);
      console.log('📄 Report ID:', response.data.id);
      console.log('📊 Status:', response.data.status);
      return true;
    } catch (error) {
      console.log('❌ Report generation test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testTrends() {
    console.log('\n📈 Testing Trends Analysis...'.cyan);

    try {
      const response = await this.client.get('/analytics/trends', {
        params: { period: '30d', metric: 'requests' }
      });

      console.log('✅ Trends analysis retrieved'.green);
      console.log('📊 Data points:', response.data.trends?.length || 0);
      console.log('📈 Analysis:', response.data.analysis);
      return true;
    } catch (error) {
      console.log('❌ Trends test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testInsights() {
    console.log('\n💡 Testing Insights...'.cyan);

    try {
      const response = await this.client.get('/analytics/insights', {
        params: { period: '7d', type: 'all' }
      });

      console.log('✅ Insights retrieved'.green);
      console.log('💡 Insights count:', response.data.insights?.length || 0);
      console.log('📊 Total:', response.data.total);
      return true;
    } catch (error) {
      console.log('❌ Insights test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testKPIs() {
    console.log('\n🎯 Testing KPIs...'.cyan);

    try {
      const response = await this.client.get('/analytics/kpi', {
        params: { period: '30d' }
      });

      console.log('✅ KPIs retrieved'.green);
      console.log('📊 KPIs count:', response.data.kpis?.length || 0);
      return true;
    } catch (error) {
      console.log('❌ KPIs test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testAlerts() {
    console.log('\n🚨 Testing Alerts...'.cyan);

    try {
      const response = await this.client.get('/analytics/alerts', {
        params: { status: 'active', priority: 'all' }
      });

      console.log('✅ Alerts retrieved'.green);
      console.log('🚨 Alerts count:', response.data.alerts?.length || 0);
      console.log('📊 Total:', response.data.total);
      return true;
    } catch (error) {
      console.log('❌ Alerts test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testAlertConfiguration() {
    console.log('\n⚙️ Testing Alert Configuration...'.cyan);

    try {
      const alertConfig = {
        alertType: 'performance',
        threshold: 80,
        enabled: true,
        notificationChannels: ['email', 'webhook']
      };

      const response = await this.client.post('/analytics/alert/configure', alertConfig);

      console.log('✅ Alert configuration updated'.green);
      console.log('⚙️ Config ID:', response.data.config?.id);
      return true;
    } catch (error) {
      console.log('❌ Alert configuration test failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Analytics Agent Tests...\n'.rainbow);

    const tests = [
      { name: 'Health Check', method: this.testHealthEndpoint },
      { name: 'Authentication', method: this.authenticate },
      { name: 'Dashboard', method: this.testDashboard },
      { name: 'Performance Metrics', method: this.testPerformanceMetrics },
      { name: 'Predictions', method: this.testPredictions },
      { name: 'Reports', method: this.testReports },
      { name: 'Report Generation', method: this.testReportGeneration },
      { name: 'Trends', method: this.testTrends },
      { name: 'Insights', method: this.testInsights },
      { name: 'KPIs', method: this.testKPIs },
      { name: 'Alerts', method: this.testAlerts },
      { name: 'Alert Configuration', method: this.testAlertConfiguration },
    ];

    const results = [];

    for (const test of tests) {
      try {
        const success = await test.method.bind(this)();
        results.push({ name: test.name, success });
      } catch (error) {
        console.log(`❌ ${test.name} crashed`.red, error.message);
        results.push({ name: test.name, success: false });
      }
    }

    this.printSummary(results);
    return results;
  }

  printSummary(results) {
    console.log('\n' + '='.repeat(50).rainbow);
    console.log('📊 TEST SUMMARY'.bold);
    console.log('='.repeat(50).rainbow);

    const passed = results.filter(r => r.success).length;
    const total = results.length;
    const successRate = ((passed / total) * 100).toFixed(1);

    results.forEach(result => {
      const icon = result.success ? '✅' : '❌';
      const color = result.success ? 'green' : 'red';
      console.log(`${icon} ${result.name}`[color]);
    });

    console.log('\n📈 Overall Results:'.bold);
    console.log(`✅ Passed: ${passed}/${total} (${successRate}%)`);

    if (passed === total) {
      console.log('🎉 All tests passed! Analytics Agent is working perfectly!'.green.bold);
    } else if (passed >= total * 0.8) {
      console.log('⚠️ Most tests passed. Some minor issues detected.'.yellow.bold);
    } else {
      console.log('❌ Multiple test failures. Please check the implementation.'.red.bold);
    }

    console.log('='.repeat(50).rainbow);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AnalyticsTester();
  tester.runAllTests()
    .then(results => {
      const passed = results.filter(r => r.success).length;
      process.exit(passed === results.length ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test suite crashed:'.red, error.message);
      process.exit(1);
    });
}

module.exports = AnalyticsTester;
