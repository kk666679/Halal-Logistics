#!/usr/bin/env node

/**
 * Automated Testing Script for Blockchain Agent API
 * Uses Newman to run POSTMAN collection tests
 *
 * Usage: node scripts/test-blockchain-api.js
 */

const newman = require('newman');
const path = require('path');

console.log('🚀 Starting Blockchain Agent API Tests...\n');

// POSTMAN collection and environment files
const collectionPath = path.join(__dirname, '../postman/Blockchain_Agent.postman_collection.json');
const environmentPath = path.join(__dirname, '../postman/test-environment.json');

// Create test environment if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(environmentPath)) {
  const testEnv = {
    "id": "test-env-id",
    "name": "Blockchain Agent Test Environment",
    "values": [
      {
        "key": "baseUrl",
        "value": "http://localhost:3026/api/v1",
        "enabled": true
      }
    ]
  };

  fs.writeFileSync(environmentPath, JSON.stringify(testEnv, null, 2));
  console.log('📝 Created test environment file');
}

const newmanOptions = {
  collection: collectionPath,
  environment: environmentPath,
  reporters: ['cli', 'json'],
  reporter: {
    json: {
      export: path.join(__dirname, '../reports/test-results.json')
    }
  },
  timeout: 10000, // 10 seconds timeout
  delayRequest: 500, // 500ms delay between requests
};

console.log('🔧 Running tests with options:');
console.log(`   Collection: ${collectionPath}`);
console.log(`   Environment: ${environmentPath}`);
console.log(`   Timeout: ${newmanOptions.timeout}ms`);
console.log(`   Delay: ${newmanOptions.delayRequest}ms\n`);

newman.run(newmanOptions, function (err, summary) {
  if (err) {
    console.error('❌ Test run failed:', err);
    process.exit(1);
  }

  console.log('\n📊 Test Summary:');
  console.log(`   Total Requests: ${summary.run.stats.requests.total}`);
  console.log(`   Failed Requests: ${summary.run.stats.requests.failed}`);
  console.log(`   Total Assertions: ${summary.run.stats.assertions.total}`);
  console.log(`   Failed Assertions: ${summary.run.stats.assertions.failed}`);
  console.log(`   Total Test Scripts: ${summary.run.stats.testScripts.total}`);
  console.log(`   Failed Test Scripts: ${summary.run.stats.testScripts.failed}`);

  // Check if all tests passed
  if (summary.run.stats.requests.failed === 0 && summary.run.stats.assertions.failed === 0) {
    console.log('\n✅ All tests passed successfully!');
    console.log('📋 Detailed results saved to: reports/test-results.json');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check the detailed report for more information.');
    console.log('📋 Detailed results saved to: reports/test-results.json');

    // Print failed requests
    if (summary.run.failures.length > 0) {
      console.log('\n🔍 Failed Requests:');
      summary.run.failures.forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.source.name}: ${failure.error.message}`);
      });
    }

    process.exit(1);
  }
});
