const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Default serverless-offline port
const API_ENDPOINT = '/data-tables';

// Test function to get mapped rows for a specific custom data type
async function testGetMappedRows(customDataId) {
  try {
    console.log('🚀 Testing get mapped rows API...');
    console.log('📡 Endpoint:', `${BASE_URL}${API_ENDPOINT}/${customDataId}/rows`);
    
    const response = await axios.get(`${BASE_URL}${API_ENDPOINT}/${customDataId}/rows`, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Success!');
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error occurred:');
    
    if (error.response) {
      // Server responded with error status
      console.error('📊 Status:', error.response.status);
      console.error('📄 Error Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Request was made but no response received
      console.error('🌐 No response received. Is the server running?');
      console.error('💡 Make sure to run: npm run dev');
    } else {
      // Something else happened
      console.error('🔧 Error:', error.message);
    }
    
    throw error;
  }
}

// Test function to get all custom data types first
async function testGetAllDataTypes() {
  try {
    console.log('\n📋 Testing GET all data types...');
    
    const response = await axios.get(`${BASE_URL}${API_ENDPOINT}`, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Success!');
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error getting data types:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    // Test 1: Get all data types to see available IDs
    console.log('='.repeat(60));
    console.log('🧪 TEST 1: Getting all data types');
    console.log('='.repeat(60));
    const dataTypes = await testGetAllDataTypes();
    
    // If we have data types, test with the first one
    if (dataTypes.data && dataTypes.data.length > 0) {
      const firstDataType = dataTypes.data[0];
      console.log(`\n📝 Using first data type: ${firstDataType.name} (ID: ${firstDataType.id})`);
      
      // Test 2: Get mapped rows for the first data type
      console.log('\n' + '='.repeat(60));
      console.log('🧪 TEST 2: Getting mapped rows for first data type');
      console.log('='.repeat(60));
      await testGetMappedRows(firstDataType.id);
    } else {
      console.log('\n⚠️  No data types found. Please create some data types first.');
      console.log('💡 Run the test-data-tables-insert.js script to create sample data types.');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  testGetMappedRows,
  testGetAllDataTypes
};

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
