# MySQL Database Setup Guide

## Step 1: Install MySQL

If you haven't installed MySQL yet:

### Windows
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Choose "MySQL Installer for Windows"
3. Select "Developer Default" or "Server only"
4. During installation, set a root password (remember this!)
5. Complete the installation

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

## Step 2: Start MySQL Service

### Windows
1. Press `Win + R`, type `services.msc`
2. Find "MySQL80" or "MySQL" service
3. Right-click → Start (if stopped)

Or using Command Prompt (as Administrator):
```cmd
net start MySQL80
```

### macOS
```bash
brew services start mysql
```

### Linux
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

## Step 3: Create Database

Open MySQL command line or MySQL Workbench:

### Using Command Line:
```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
CREATE DATABASE freelancing_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Using MySQL Workbench (GUI):
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click "Create a new schema" icon
4. Name: `freelancing_marketplace`
5. Default Collation: `utf8mb4_unicode_ci`
6. Click Apply

## Step 4: Update Environment Variables

Edit `backend/.env` file and update:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancing_marketplace
DB_USER=root
DB_PASSWORD=your_mysql_root_password
```

**Important:** Replace `your_mysql_root_password` with your MySQL root password!

## Step 5: Install MySQL Dependencies

```bash
cd backend
npm install mysql2
```

This will install the MySQL2 driver required by Sequelize.

## Step 6: Test Database Connection

```bash
cd backend
npm run test-db
```

You should see:
```
✅ Database connection established successfully.
```

## Step 7: Run Database Migrations

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

### Error: "Access denied for user"
- Check your password in `.env` file
- Verify username is correct (usually `root`)
- Try resetting MySQL password if needed

### Error: "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check if MySQL is listening on port 3306
- Verify firewall settings

### Error: "Unknown database"
- Create the database: `CREATE DATABASE freelancing_marketplace;`

### Error: "ECONNREFUSED"
- MySQL service is not running
- Start the service (see Step 2)

### Port Already in Use
- Check if another MySQL instance is running
- Change port in `.env` if using non-standard port

## Quick Start Commands

```bash
# 1. Install MySQL dependencies
cd backend
npm install mysql2

# 2. Test connection
npm run test-db

# 3. Run migrations (creates tables)
npm run migrate

# 4. Start server
npm run dev
```

## Alternative: Using Different MySQL User

If you want to create a dedicated user:

```sql
-- Create user
CREATE USER 'freelancing_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON freelancing_marketplace.* TO 'freelancing_user'@'localhost';
FLUSH PRIVILEGES;

-- Update .env
DB_USER=freelancing_user
DB_PASSWORD=secure_password
```

## Verify Tables Created

After migration, verify tables:

```sql
USE freelancing_marketplace;
SHOW TABLES;
```

You should see tables like:
- users
- profiles
- jobs
- bids
- contracts
- payments
- etc.

## MySQL Configuration Tips

For better performance, you can add to `my.cnf` or `my.ini`:

```ini
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
max_connections=200
innodb_buffer_pool_size=1G
```

## Windows Specific Notes

- Default MySQL service name: `MySQL80` or `MySQL`
- Default installation path: `C:\Program Files\MySQL\MySQL Server 8.0\`
- Configuration file: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`

