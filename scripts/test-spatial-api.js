// Test script for spatial API endpoints
// Run with: node scripts/test-spatial-api.js

const testGeometry = {
  geometry: {
    rings: [
      [
        [474056.14609999955, 1030648.0333999991],
        [475607.62939999998, 1030492.8850999996],
        [474211.29440000001, 1029251.6984000001],
        [474056.14609999955, 1030648.0333999991],
      ],
    ],
  },
  spatialReference: { wkid: 20137 },
};

async function testValidationEndpoint() {
  console.log('Testing geometry validation endpoint...');

  try {
    const response = await fetch(
      'http://localhost:3000/plot/validate-geometry',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ geo: testGeometry }),
      },
    );

    const result = await response.json();
    console.log('Validation result:', JSON.stringify(result, null, 2));

    if (result.valid) {
      console.log('✅ Geometry validation test PASSED');
    } else {
      console.log('❌ Geometry validation test FAILED');
    }
  } catch (error) {
    console.log('❌ Validation endpoint test FAILED:', error.message);
  }
}

async function testSpatialEndpoint() {
  console.log('\nTesting spatial query endpoint...');

  try {
    // Test bounding box query
    const bboxResponse = await fetch(
      'http://localhost:3000/plot/spatial?bbox=470000,1029000,476000,1031000',
    );
    const bboxResult = await bboxResponse.json();

    console.log('Bounding box query result:', {
      total: bboxResult.pagination?.total || 0,
      hasData: bboxResult.data?.length > 0,
    });

    if (bboxResult.pagination?.total >= 0) {
      console.log('✅ Spatial query test PASSED');
    } else {
      console.log('❌ Spatial query test FAILED');
    }
  } catch (error) {
    console.log('❌ Spatial endpoint test FAILED:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting PostGIS API tests...\n');

  await testValidationEndpoint();
  await testSpatialEndpoint();

  console.log('\n✨ Tests completed!');
  console.log('\nTo run these tests:');
  console.log('1. Start the application: npm run start:dev');
  console.log('2. Run this script: node scripts/test-spatial-api.js');
}

// Only run if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testValidationEndpoint, testSpatialEndpoint };
