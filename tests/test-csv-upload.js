const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Default serverless-offline port
const API_ENDPOINT = '/data-tables';

// Sample CSV data for CustomerProfile
const customerProfileCsv = `customer_id,first_name,last_name,email,phone,date_of_birth,is_active
CUST001,John,Doe,john.doe@email.com,+1234567890,1990-05-15,true
CUST002,Jane,Smith,jane.smith@email.com,+1234567891,1985-08-22,true
CUST003,Bob,Johnson,bob.johnson@email.com,+1234567892,1978-12-10,false
CUST004,Alice,Brown,alice.brown@email.com,+1234567893,1992-03-28,true
CUST005,Charlie,Wilson,charlie.wilson@email.com,+1234567894,1987-11-05,true`;

// Sample CSV data for ProductCatalog
const productCatalogCsv = `product_id,product_name,category,price,stock_quantity,description
PROD001,Laptop Pro,Electronics,1299.99,50,High-performance laptop for professionals
PROD002,Wireless Mouse,Electronics,29.99,200,Ergonomic wireless mouse
PROD003,Coffee Maker,Home & Kitchen,89.99,30,Programmable coffee maker
PROD004,Running Shoes,Sports,79.99,100,Comfortable running shoes
PROD005,Desk Lamp,Home & Office,45.99,75,LED desk lamp with adjustable brightness`;

// Test function to create a custom data type
async function createCustomDataType(payload) {
  try {
    console.log('📝 Creating custom data type...');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${BASE_URL}${API_ENDPOINT}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Custom data type created successfully!');
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating custom data type:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Error Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('🔧 Error:', error.message);
    }
    
    throw error;
  }
}

// Test function to upload CSV data
async function uploadCsvData(customDataId, csvContent, filename) {
  try {
    console.log(`📤 Uploading CSV data to custom data type ${customDataId}...`);
    
    // Create form data
    const form = new FormData();
    form.append('csvFile', Buffer.from(csvContent), {
      filename: filename,
      contentType: 'text/csv'
    });

    const response = await axios.post(`${BASE_URL}${API_ENDPOINT}/${customDataId}/upload-csv`, form, {
      headers: {
        ...form.getHeaders(),
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 second timeout for file upload
    });

    console.log('✅ CSV upload successful!');
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading CSV:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Error Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('🔧 Error:', error.message);
    }
    
    throw error;
  }
}

// Test function to get all custom data types
async function getAllCustomDataTypes() {
  try {
    console.log('📋 Getting all custom data types...');
    
    const response = await axios.get(`${BASE_URL}${API_ENDPOINT}`, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Retrieved custom data types!');
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error getting custom data types:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    // Test 1: Get existing custom data types
    console.log('='.repeat(60));
    console.log('🧪 TEST 1: Getting existing custom data types');
    console.log('='.repeat(60));
    const existingTypes = await getAllCustomDataTypes();
    
    let customerProfileId = null;
    let productCatalogId = null;
    
    // Check if CustomerProfile exists
    if (existingTypes.data && existingTypes.data.length > 0) {
      const customerProfile = existingTypes.data.find(type => type.name === 'CustomerProfile');
      if (customerProfile) {
        customerProfileId = customerProfile.id;
        console.log(`✅ Found existing CustomerProfile with ID: ${customerProfileId}`);
      }
      
      const productCatalog = existingTypes.data.find(type => type.name === 'ProductCatalog');
      if (productCatalog) {
        productCatalogId = productCatalog.id;
        console.log(`✅ Found existing ProductCatalog with ID: ${productCatalogId}`);
      }
    }
    
    // Test 2: Create CustomerProfile if it doesn't exist
    if (!customerProfileId) {
      console.log('\n' + '='.repeat(60));
      console.log('🧪 TEST 2: Creating CustomerProfile custom data type');
      console.log('='.repeat(60));
      
      const customerProfilePayload = {
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
      
      const customerProfileResult = await createCustomDataType(customerProfilePayload);
      customerProfileId = customerProfileResult.data.id;
    }
    
    // Test 3: Create ProductCatalog if it doesn't exist
    if (!productCatalogId) {
      console.log('\n' + '='.repeat(60));
      console.log('🧪 TEST 3: Creating ProductCatalog custom data type');
      console.log('='.repeat(60));
      
      const productCatalogPayload = {
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
      
      const productCatalogResult = await createCustomDataType(productCatalogPayload);
      productCatalogId = productCatalogResult.data.id;
    }
    
    // Test 4: Upload CSV data to CustomerProfile
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST 4: Uploading CSV data to CustomerProfile');
    console.log('='.repeat(60));
    await uploadCsvData(customerProfileId, customerProfileCsv, 'customers.csv');
    
    // Test 5: Upload CSV data to ProductCatalog
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST 5: Uploading CSV data to ProductCatalog');
    console.log('='.repeat(60));
    await uploadCsvData(productCatalogId, productCatalogCsv, 'products.csv');
    
    console.log('\n🎉 All CSV upload tests completed successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   - CustomerProfile ID: ${customerProfileId}`);
    console.log(`   - ProductCatalog ID: ${productCatalogId}`);
    console.log(`\n💡 You can now test the rows-mapped endpoint with these IDs!`);
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  createCustomDataType,
  uploadCsvData,
  getAllCustomDataTypes,
  customerProfileCsv,
  productCatalogCsv
};

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
