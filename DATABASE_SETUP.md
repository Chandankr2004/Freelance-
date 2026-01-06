# Database Setup Guide (MySQL)

## Step 1: Install MySQL

If you haven't installed PostgreSQL yet:

### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create Database

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE freelancing_marketplace;
```

Or using command line:
```bash
# Windows (Command Prompt)
psql -U postgres
CREATE DATABASE freelancing_marketplace;
\q

# macOS/Linux
sudo -u postgres psql
CREATE DATABASE freelancing_marketplace;
\q
```

## Step 3: Configure Environment Variables

1. Open `backend/.env` file
2. Update the database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=freelancing_marketplace
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
```

**Important:** Replace `your_actual_password_here` with your PostgreSQL password!

## Step 4: Test Database Connection

Run the test script:

```bash
cd backend
npm run test-db
```

You should see:
```
✅ Database connection established successfully.
```

If you see an error, check:
- PostgreSQL service is running
- Database name is correct
- Username and password are correct
- Database exists

## Step 5: Run Database Migrations

Once the connection is successful, create all tables:

```bash
cd backend
npm run migrate
```

This will:
- Create all database tables
- Set up relationships
- Seed initial categories and skills

## Troubleshooting

### Error: "password authentication failed"
- Check your password in `.env` file
- Try resetting PostgreSQL password:
  ```sql
  ALTER USER postgres PASSWORD 'new_password';
  ```

### Error: "database does not exist"
- Create the database: `CREATE DATABASE freelancing_marketplace;`

### Error: "connection refused"
- Make sure PostgreSQL is running:
  - Windows: Check Services
  - macOS: `brew services list`
  - Linux: `sudo systemctl status postgresql`

### Error: "role does not exist"
- Create a user or use existing postgres user
- Or update `DB_USER` in `.env` to an existing user

## Quick Start Commands

```bash
# 1. Test connection
cd backend
npm run test-db

# 2. Run migrations (creates tables)
npm run migrate

# 3. Start server
npm run dev
```

## Alternative: Using Different Database User

If you want to create a dedicated user:

```sql
-- Create user
CREATE USER freelancing_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE freelancing_marketplace TO freelancing_user;

-- Update .env
DB_USER=freelancing_user
DB_PASSWORD=secure_password
```

## Verify Tables Created

After migration, you can verify tables:

```sql
\c freelancing_marketplace
\dt
```

You should see tables like:
- users
- profiles
- jobs
- bids
- contracts
- payments
- etc.

