const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Default serverless-offline port
const API_ENDPOINT = '/data-tables';

// Test payload for creating a custom data type
const testPayload = {
  custom_data_name: "CustomerProfile",
  fields: [
    {
      name: "customer_id",
      field_type: "STRING",
      length: 50,
      is_required: true,
      key_field: true,
      filter: true
    },
    {
      name: "first_name",
      field_type: "STRING",
      length: 100,
      is_required: true,
      key_field: false,
      filter: true
    },
    {
      name: "last_name",
      field_type: "STRING",
      length: 100,
      is_required: true,
      key_field: false,
      filter: true
    },
    {
      name: "email",
      field_type: "STRING",
      length: 255,
      is_required: true,
      key_field: false,
      filter: true
    },
    {
      name: "phone",
      field_type: "STRING",
      length: 20,
      is_required: false,
      key_field: false,
      filter: false
    },
    {
      name: "date_of_birth",
      field_type: "DATE",
      length: null,
      is_required: false,
      key_field: false,
      filter: false
    },
    {
      name: "is_active",
      field_type: "BOOLEAN",
      length: null,
      is_required: false,
      key_field: false,
      filter: true
    }
  ]
};

// Alternative test payload for a different data type
const alternativePayload = {
  custom_data_name: "ProductCatalog",
  fields: [
    {
      name: "product_id",
      field_type: "STRING",
      length: 50,
      is_required: true,
      key_field: true,
      filter: true
    },
    {
      name: "product_name",
      field_type: "STRING",
      length: 200,
      is_required: true,
      key_field: false,
      filter: true
    },
    {
      name: "category",
      field_type: "STRING",
      length: 100,
      is_required: true,
      key_field: false,
      filter: true
    },
    {
      name: "price",
      field_type: "DECIMAL",
      length: 10,
      is_required: true,
      key_field: false,
      filter: true
    },
    {
      name: "stock_quantity",
      field_type: "INTEGER",
      length: null,
      is_required: false,
      key_field: false,
      filter: true
    },
    {
      name: "description",
      field_type: "TEXT",
      length: null,
      is_required: false,
      key_field: false,
      filter: false
    }
  ]
};

async function testDataTablesInsert(payload = testPayload) {
  try {
    console.log('🚀 Testing data-tables insert API...');
    console.log('📡 Endpoint:', `${BASE_URL}${API_ENDPOINT}`);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${BASE_URL}${API_ENDPOINT}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
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

// Test function to get all custom data types
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
    // Test 1: Create CustomerProfile data type
    console.log('='.repeat(60));
    console.log('🧪 TEST 1: Creating CustomerProfile data type');
    console.log('='.repeat(60));
    await testDataTablesInsert(testPayload);
    
    // Test 2: Create ProductCatalog data type
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST 2: Creating ProductCatalog data type');
    console.log('='.repeat(60));
    await testDataTablesInsert(alternativePayload);
    
    // Test 3: Get all data types
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST 3: Getting all data types');
    console.log('='.repeat(60));
    await testGetAllDataTypes();
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  testDataTablesInsert,
  testGetAllDataTypes,
  testPayload,
  alternativePayload
};

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
