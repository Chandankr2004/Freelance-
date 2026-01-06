# Quick Database Setup

## ✅ Step 1: Install PostgreSQL (if not installed)

### Check if PostgreSQL is installed:
```powershell
psql --version
```

If not installed, download from: https://www.postgresql.org/download/windows/

## ✅ Step 2: Start PostgreSQL Service

### Option A: Using Services (Windows)
1. Press `Win + R`, type `services.msc`
2. Find "postgresql-x64-XX" service
3. Right-click → Start (if stopped)

### Option B: Using Command Line
```powershell
# Check if service exists
Get-Service -Name postgresql*

# Start the service (replace with actual service name)
Start-Service postgresql-x64-15
```

## ✅ Step 3: Create Database

Open PostgreSQL command line:
```powershell
# Option 1: Using psql
psql -U postgres

# Then in psql prompt:
CREATE DATABASE freelancing_marketplace;
\q
```

Or using pgAdmin (GUI):
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `freelancing_marketplace`
5. Click Save

## ✅ Step 4: Update .env File

Edit `backend/.env` and update:
```env
DB_PASSWORD=your_postgres_password
```

Replace `your_postgres_password` with the password you set during PostgreSQL installation.

## ✅ Step 5: Test Connection

```powershell
cd backend
npm run test-db
```

You should see: ✅ Database connection established successfully.

## ✅ Step 6: Run Migrations

Once connected, create all tables:
```powershell
npm run migrate
```

## 🔧 Troubleshooting

### "Connection refused" Error
- PostgreSQL service is not running
- Start the service (see Step 2)

### "Password authentication failed"
- Wrong password in `.env` file
- Update `DB_PASSWORD` in `backend/.env`

### "Database does not exist"
- Create the database (see Step 3)

### "Role does not exist"
- Use `postgres` user or create a new user
- Update `DB_USER` in `.env` if using different user

## 🚀 Quick Commands

```powershell
# 1. Test connection
cd backend
npm run test-db

# 2. Create tables (after successful connection)
npm run migrate

# 3. Start server
npm run dev
```

