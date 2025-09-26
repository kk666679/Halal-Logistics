#!/usr/bin/env node

/**
 * Document Agent Test Script
 * Tests all API endpoints and functionality
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3015/api/v1';
const TEST_USER = {
  username: 'test-admin',
  password: 'test-password-123'
};

let authToken = null;

class DocumentTester {
  constructor() {
    this.baseURL = BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // Increased timeout for file operations
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
      const response = await this.client.get('/document/health');
      console.log('✅ Health check passed'.green, response.data);
      return true;
    } catch (error) {
      console.log('❌ Health check failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentUpload() {
    console.log('\n📤 Testing Document Upload...'.cyan);

    try {
      // Create a test file
      const testFilePath = path.join(__dirname, 'test-document.txt');
      fs.writeFileSync(testFilePath, 'This is a test document for the Document Agent.\nIt contains sample text for processing.');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(testFilePath));
      formData.append('metadata', JSON.stringify({
        documentType: 'test',
        supplierId: 'TEST-001',
        description: 'Test document for API validation'
      }));

      const response = await this.client.post('/document/upload', formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('✅ Document upload successful'.green);
      console.log('📄 Document ID:', response.data.documentId);

      // Clean up test file
      fs.unlinkSync(testFilePath);

      return true;
    } catch (error) {
      console.log('❌ Document upload failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentList() {
    console.log('\n📋 Testing Document List...'.cyan);

    try {
      const response = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { page: 1, limit: 5 }
      });

      console.log('✅ Document list retrieved'.green);
      console.log('📊 Total documents:', response.data.pagination?.total || 0);
      console.log('📄 Documents returned:', response.data.documents?.length || 0);
      return true;
    } catch (error) {
      console.log('❌ Document list failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentProcessing() {
    console.log('\n⚙️ Testing Document Processing...'.cyan);

    try {
      // First get a document to process
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for processing'.yellow);
        return true; // Skip test if no documents
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.post(`/document/process/${documentId}`, {
        processingType: 'auto',
        options: {
          extractText: true,
          extractMetadata: true,
          validateFormat: true
        }
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      console.log('✅ Document processing initiated'.green);
      console.log('📄 Document ID:', documentId);
      console.log('⏱️ Estimated time:', response.data.estimatedTime);
      return true;
    } catch (error) {
      console.log('❌ Document processing failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentExtraction() {
    console.log('\n🔍 Testing Document Data Extraction...'.cyan);

    try {
      // Get a document for extraction
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for extraction'.yellow);
        return true;
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.get(`/document/${documentId}/extract`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: {
          extractionType: 'full',
          fields: ['text', 'metadata', 'tables']
        }
      });

      console.log('✅ Document extraction successful'.green);
      console.log('📄 Document ID:', documentId);
      console.log('📊 Extraction type:', response.data.extractionType);
      console.log('⏱️ Processing time:', response.data.processingTime + 'ms');
      return true;
    } catch (error) {
      console.log('❌ Document extraction failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentAnalysis() {
    console.log('\n📊 Testing Document Analysis...'.cyan);

    try {
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for analysis'.yellow);
        return true;
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.get(`/document/${documentId}/analyze`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: {
          type: 'content',
          depth: 'standard'
        }
      });

      console.log('✅ Document analysis successful'.green);
      console.log('📄 Document ID:', documentId);
      console.log('📊 Analysis type:', response.data.analysis.type);
      console.log('🎯 Confidence:', response.data.analysis.confidence);
      return true;
    } catch (error) {
      console.log('❌ Document analysis failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentValidation() {
    console.log('\n✅ Testing Document Validation...'.cyan);

    try {
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for validation'.yellow);
        return true;
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.post(`/document/${documentId}/validate`, {
        rules: 'standard',
        strict: false
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      console.log('✅ Document validation successful'.green);
      console.log('📄 Document ID:', documentId);
      console.log('📊 Overall status:', response.data.results.overall.status);
      console.log('📈 Overall score:', response.data.results.overall.score);
      return true;
    } catch (error) {
      console.log('❌ Document validation failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentConversion() {
    console.log('\n🔄 Testing Document Conversion...'.cyan);

    try {
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for conversion'.yellow);
        return true;
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.get(`/document/${documentId}/convert`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: {
          targetFormat: 'pdf',
          quality: 'high'
        }
      });

      console.log('✅ Document conversion initiated'.green);
      console.log('📄 Document ID:', documentId);
      console.log('🎯 Target format:', response.data.conversion.targetFormat);
      console.log('⏱️ Estimated time:', response.data.conversion.estimatedTime);
      return true;
    } catch (error) {
      console.log('❌ Document conversion failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentClassification() {
    console.log('\n🏷️ Testing Document Classification...'.cyan);

    try {
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for classification'.yellow);
        return true;
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.post(`/document/${documentId}/classify`, {
        categories: ['halal_certificate', 'supply_agreement'],
        confidence: 0.8
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      console.log('✅ Document classification successful'.green);
      console.log('📄 Document ID:', documentId);
      console.log('🏷️ Categories found:', response.data.classification.categories.length);
      console.log('🎯 Method:', response.data.classification.classificationMethod);
      return true;
    } catch (error) {
      console.log('❌ Document classification failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentSearch() {
    console.log('\n🔍 Testing Document Search...'.cyan);

    try {
      const listResponse = await this.client.get('/document/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { limit: 1 }
      });

      if (!listResponse.data.documents || listResponse.data.documents.length === 0) {
        console.log('⚠️ No documents available for search'.yellow);
        return true;
      }

      const documentId = listResponse.data.documents[0].id;

      const response = await this.client.get(`/document/${documentId}/search`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: {
          query: 'halal',
          type: 'text',
          caseSensitive: false,
          wholeWords: false
        }
      });

      console.log('✅ Document search successful'.green);
      console.log('📄 Document ID:', documentId);
      console.log('🔍 Query:', response.data.query);
      console.log('📊 Results found:', response.data.results.length);
      console.log('⏱️ Search time:', response.data.searchTime + 'ms');
      return true;
    } catch (error) {
      console.log('❌ Document search failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentTemplates() {
    console.log('\n📋 Testing Document Templates...'.cyan);

    try {
      const response = await this.client.get('/document/templates/list', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { type: 'certificate' }
      });

      console.log('✅ Document templates retrieved'.green);
      console.log('📊 Templates count:', response.data.templates?.length || 0);
      console.log('📄 Total:', response.data.total);
      return true;
    } catch (error) {
      console.log('❌ Document templates failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async testDocumentAnalytics() {
    console.log('\n📈 Testing Document Analytics...'.cyan);

    try {
      const response = await this.client.get('/document/analytics/usage', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { period: '30d', metric: 'usage' }
      });

      console.log('✅ Document analytics retrieved'.green);
      console.log('📊 Period:', response.data.period);
      console.log('📈 Metric:', response.data.metric);
      console.log('📄 Total documents:', response.data.data.totalDocuments);
      return true;
    } catch (error) {
      console.log('❌ Document analytics failed'.red, error.response?.data?.message || error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Document Agent Tests...\n'.rainbow);

    const tests = [
      { name: 'Health Check', method: this.testHealthEndpoint },
      { name: 'Authentication', method: this.authenticate },
      { name: 'Document Upload', method: this.testDocumentUpload },
      { name: 'Document List', method: this.testDocumentList },
      { name: 'Document Processing', method: this.testDocumentProcessing },
      { name: 'Document Extraction', method: this.testDocumentExtraction },
      { name: 'Document Analysis', method: this.testDocumentAnalysis },
      { name: 'Document Validation', method: this.testDocumentValidation },
      { name: 'Document Conversion', method: this.testDocumentConversion },
      { name: 'Document Classification', method: this.testDocumentClassification },
      { name: 'Document Search', method: this.testDocumentSearch },
      { name: 'Document Templates', method: this.testDocumentTemplates },
      { name: 'Document Analytics', method: this.testDocumentAnalytics },
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
      console.log('🎉 All tests passed! Document Agent is working perfectly!'.green.bold);
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
  const tester = new DocumentTester();
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

module.exports = DocumentTester;
