# Database Setup Guide

This project uses Sequelize ORM with PostgreSQL 17 for data persistence.

## Prerequisites

1. PostgreSQL 17 installed and running
2. Node.js and npm installed

## Database Configuration

### 1. Create Database

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE "comp360-sc";
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=comp360-sc
DB_USER=local
DB_PASSWORD=root

# Environment
NODE_ENV=development
STAGE=dev
```

### 3. Install Dependencies

```bash
npm install
```

## Database Models

The following models have been created:

### User Model
- `id` (UUID, Primary Key)
- `name` (STRING, nullable)
- `domain` (STRING, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### CustomData Model
- `id` (INTEGER, Primary Key, Auto Increment)
- `name` (STRING, required)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### CustomDataField Model
- `id` (INTEGER, Primary Key, Auto Increment)
- `custom_data_id` (INTEGER, Foreign Key to CustomData)
- `name` (STRING, required)
- `field_type` (STRING, required)
- `length` (INTEGER, nullable)
- `is_required` (BOOLEAN, default: false)
- `key_field` (BOOLEAN, default: false)
- `filter` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### CustomDataValue Model
- `id` (INTEGER, Primary Key, Auto Increment)
- `value` (STRING, nullable)
- `uuid` (UUID, required)
- `custom_data_id` (INTEGER, Foreign Key to CustomData)
- `custom_field_id` (INTEGER, Foreign Key to CustomDataField)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Testing the Connection

Run the database connection test:

```bash
node src/shared/db/test-connection.js
```

This will:
1. Test the database connection
2. Create test records for all models
3. Test associations between models
4. Clean up test data
5. Close the connection

## Usage in Application

### Initialize Database

```javascript
const { initializeDatabase } = require('./src/shared/db/init');

// In your application startup
await initializeDatabase();
```

### Using the Database Service

```javascript
const db = require('./src/shared/db/database');

// Create a user
const user = await db.createUser({
  name: 'John Doe',
  domain: 'example.com'
});

// Get all users
const users = await db.getAllUsers();

// Create custom data with fields
const customData = await db.createCustomData({
  name: 'Customer Data'
});

const field = await db.createCustomDataField({
  custom_data_id: customData.id,
  name: 'Email',
  field_type: 'string',
  is_required: true
});

const value = await db.createCustomDataValue({
  custom_data_id: customData.id,
  custom_field_id: field.id,
  value: 'john@example.com',
  uuid: '550e8400-e29b-41d4-a716-446655440000'
});
```

## Migration Strategy

For production environments, it's recommended to use Sequelize migrations instead of `sync()`. The current setup uses `sync({ alter: true })` for development convenience.

To set up migrations:

1. Install sequelize-cli: `npm install -g sequelize-cli`
2. Initialize migrations: `sequelize init`
3. Create migration files for each model
4. Use `sequelize db:migrate` instead of `sync()`

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running on the correct port
- Check database credentials in `.env` file
- Ensure the database `comp360-sc` exists

### Permission Issues
- Make sure the PostgreSQL user has proper permissions
- Check if the user can create tables in the database

### Model Sync Issues
- Check for syntax errors in model definitions
- Verify foreign key relationships are correct
- Ensure all required fields are properly defined
