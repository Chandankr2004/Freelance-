# Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

From the root directory, run:
```bash
npm run install-all
```

This will install dependencies for:
- Root package.json
- Backend (Express.js, Sequelize, etc.)
- Frontend (React, React Router, etc.)

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE freelancing_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with your MySQL database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancing_marketplace
DB_USER=root
DB_PASSWORD=your_mysql_password
```

4. Install MySQL driver:
```bash
cd backend
npm install mysql2
```

4. Update `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Test Database Connection

```bash
cd backend
npm run test-db
```

### 5. Run Database Migrations

```bash
cd backend
npm run migrate
```

This will:
- Create all database tables
- Set up relationships
- Seed initial categories and skills

### 6. Start Development Servers

From the root directory:
```bash
npm run dev
```

This starts both:
- Backend server on http://localhost:5000
- Frontend React app on http://localhost:3000

Or start them separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Creating Admin User

After running migrations, you can create an admin user by:

1. Register a regular user through the frontend
2. Update the user's role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Features Implemented

✅ User Authentication (JWT)
✅ User Registration & Login
✅ Profile Management
✅ Job Posting & Browsing
✅ Bidding System
✅ Contract Management
✅ Milestone System
✅ Payment Structure (ready for gateway integration)
✅ Transaction History
✅ Reviews & Ratings
✅ Messaging System (API ready)
✅ Support Tickets (API ready)
✅ Admin Dashboard
✅ Multi-role Dashboards
✅ 2FA Setup (API ready)

## Payment Gateway Integration

The payment system is structured to support multiple payment gateways. To integrate:

1. Add your payment gateway SDK to `backend/package.json`
2. Update `backend/controllers/paymentController.js` in the `processPayment` function
3. Add webhook handlers for payment callbacks
4. Update frontend payment forms as needed

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- 2FA support (TOTP)
- Rate limiting
- CORS configuration
- Input validation
- SQL injection protection (Sequelize ORM)

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Update database credentials
3. Set secure JWT secret
4. Configure CORS for your domain
5. Use process manager (PM2) or container orchestration

### Frontend

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Serve the `build` folder with a web server (nginx, Apache, etc.)
3. Configure API proxy if needed

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_NAME` - Database name (default: freelancing_marketplace)
- `DB_USER` - MySQL user (default: root)
- `DB_PASSWORD` - MySQL password (required)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration (default: 7d)
- `EMAIL_*` - Email service configuration
- `PLATFORM_FEE_PERCENTAGE` - Platform commission (default: 10)
- `MIN_WITHDRAWAL_AMOUNT` - Minimum withdrawal (default: 50)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SOCKET_URL` - WebSocket server URL

## Troubleshooting

### Database Connection Issues
- Verify MySQL service is running
- Check database credentials in `.env`
- Ensure database exists
- Make sure `mysql2` package is installed: `npm install mysql2`

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `REACT_APP_API_URL` in frontend `.env`

### Migration Errors
- Drop and recreate database if needed
- Check Sequelize version compatibility

## Next Steps

1. Integrate payment gateway (Stripe, PayPal, etc.)
2. Set up email service (SendGrid, AWS SES, etc.)
3. Configure file storage (AWS S3, Cloudinary, etc.)
4. Add Socket.io for real-time chat
5. Implement i18n for multi-language support
6. Add comprehensive error logging
7. Set up monitoring and analytics

