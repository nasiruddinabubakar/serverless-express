const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Default serverless-offline port
const API_ENDPOINT = '/data-tables';

// Sample CSV data for CustomerProfile
const customerProfileCsv = `customer_id,first_name,last_name,email,phone,date_of_birth,is_active
CUST001,John,Doe,john.doe@email.com,555-0101,1990-01-15,true
CUST002,Jane,Smith,jane.smith@email.com,555-0102,1985-03-22,true
CUST003,Bob,Johnson,bob.johnson@email.com,555-0103,1978-07-10,false
CUST004,Alice,Brown,alice.brown@email.com,555-0104,1992-11-05,true
CUST005,Charlie,Wilson,charlie.wilson@email.com,555-0105,1980-09-18,true`;

// Sample CSV data for ProductCatalog
const productCatalogCsv = `product_id,product_name,category,price,stock_quantity,description
PROD001,Laptop Computer,Electronics,999.99,50,High-performance laptop with 16GB RAM
PROD002,Wireless Mouse,Electronics,29.99,200,Ergonomic wireless mouse with long battery life
PROD003,Coffee Maker,Home & Kitchen,89.99,30,Programmable coffee maker with thermal carafe
PROD004,Running Shoes,Sports,129.99,75,Lightweight running shoes with excellent cushioning
PROD005,Desk Lamp,Home & Office,45.99,100,LED desk lamp with adjustable brightness`;

// Function to create a temporary CSV file
function createTempCsvFile(content, filename) {
  const tempDir = path.join(__dirname, 'temp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  const filePath = path.join(tempDir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

// Function to clean up temporary files
function cleanupTempFiles(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Test CSV upload function
async function testCsvUpload(customDataId, csvContent, csvFilename) {
  try {
    console.log(`🚀 Testing CSV upload for custom data ID: ${customDataId}`);
    console.log(`📁 CSV Filename: ${csvFilename}`);
    
    // Create temporary CSV file
    const tempFilePath = createTempCsvFile(csvContent, csvFilename);
    
    // Create form data
    const formData = new FormData();
    formData.append('csvFile', fs.createReadStream(tempFilePath), {
      filename: csvFilename,
      contentType: 'text/csv'
    });

    const response = await axios.post(`${BASE_URL}${API_ENDPOINT}/${customDataId}/upload-csv`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 second timeout for file upload
    });

    console.log('✅ CSV upload successful!');
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    // Clean up temporary file
    cleanupTempFiles(tempFilePath);
    
    return response.data;
  } catch (error) {
    console.error('❌ CSV upload failed:');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Error Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('🌐 No response received. Is the server running?');
      console.error('💡 Make sure to run: npm run dev');
    } else {
      console.error('🔧 Error:', error.message);
    }
    
    throw error;
  }
}

// Function to get all custom data types
async function getAllCustomDataTypes() {
  try {
    console.log('\n📋 Getting all custom data types...');
    
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

// Main execution function
async function main() {
  try {
    // First, get all custom data types to see available IDs
    console.log('='.repeat(60));
    console.log('🧪 STEP 1: Getting all custom data types');
    console.log('='.repeat(60));
    const dataTypesResponse = await getAllCustomDataTypes();
    
    // Extract custom data IDs from the response
    const customDataTypes = dataTypesResponse.data || [];
    
    if (customDataTypes.length === 0) {
      console.log('❌ No custom data types found. Please create some first using test-data-tables-insert.js');
      return;
    }
    
    console.log('\n📋 Available custom data types:');
    customDataTypes.forEach((type, index) => {
      console.log(`${index + 1}. ID: ${type.id}, Name: ${type.name}`);
    });
    
    // Test CSV upload for each custom data type
    for (const customDataType of customDataTypes) {
      console.log('\n' + '='.repeat(60));
      console.log(`🧪 Testing CSV upload for: ${customDataType.name} (ID: ${customDataType.id})`);
      console.log('='.repeat(60));
      
      // Choose appropriate CSV content based on the custom data type name
      let csvContent, csvFilename;
      
      if (customDataType.name.toLowerCase().includes('customer')) {
        csvContent = customerProfileCsv;
        csvFilename = 'customer_profile_sample.csv';
      await testCsvUpload(customDataType.id, csvContent, csvFilename);

      } else if (customDataType.name.toLowerCase().includes('product')) {
        csvContent = productCatalogCsv;
        csvFilename = 'product_catalog_sample.csv';
      } else {
        // Generic CSV for other types
        csvContent = `field1,field2,field3\nvalue1,value2,value3\nvalue4,value5,value6`;
        csvFilename = 'generic_sample.csv';
      }
      
    }
    
    console.log('\n🎉 All CSV upload tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  testCsvUpload,
  getAllCustomDataTypes,
  customerProfileCsv,
  productCatalogCsv
};

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}
