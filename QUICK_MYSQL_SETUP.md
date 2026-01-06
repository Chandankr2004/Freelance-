# Quick MySQL Setup

## ✅ Step 1: Install MySQL

Download from: https://dev.mysql.com/downloads/installer/

During installation:
- Set a root password (remember it!)
- Note the port (default: 3306)

## ✅ Step 2: Start MySQL Service

### Windows:
```powershell
# Check service status
Get-Service -Name MySQL*

# Start service (replace MySQL80 with your service name)
Start-Service MySQL80
```

Or use Services app:
- Press `Win + R`, type `services.msc`
- Find "MySQL80" → Right-click → Start

## ✅ Step 3: Create Database

Open MySQL Command Line Client or MySQL Workbench:

```sql
CREATE DATABASE freelancing_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## ✅ Step 4: Update .env File

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancing_marketplace
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

## ✅ Step 5: Install Dependencies

```powershell
cd backend
npm install mysql2
```

## ✅ Step 6: Test Connection

```powershell
npm run test-db
```

Expected output: ✅ Database connection established successfully.

## ✅ Step 7: Run Migrations

```powershell
npm run migrate
```

## 🔧 Troubleshooting

### "ECONNREFUSED" Error
→ MySQL service is not running. Start it (Step 2).

### "Access denied" Error
→ Wrong password. Update `DB_PASSWORD` in `.env`.

### "Unknown database" Error
→ Create database (Step 3).

### "mysql2 module not found"
→ Run `npm install mysql2` (Step 5).

## 🚀 All-in-One Command

```powershell
cd backend
npm install mysql2
npm run test-db
npm run migrate
```

