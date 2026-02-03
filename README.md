# Freelancing Marketplace Web Application


Link to open:https://chandankr2004.github.io/Freelance-/#/




A full-featured freelancing marketplace platform that connects businesses with freelancers and agencies across multiple industries.

## 🛠️ Technology Stack

- **Frontend:** React.js with modern UI/UX
- **Backend:** Node.js + Express.js
- **Database:** MySQL (SQL)
- **Authentication:** JWT-based authentication
- **Architecture:** RESTful APIs

## 🌐 Core Features

1. **Complete Freelancing Marketplace**
   - Connect businesses with freelancers and agencies
   - Multiple categories (writing, design, development, marketing, etc.)
   - Job posting, browsing, and talent discovery
   - Advanced search and filtering

2. **Bidding & Contract System**
   - Freelancers can bid on posted jobs
   - Fixed-price project hiring
   - Secure contracts with milestones and deadlines
   - Escrow-style payment handling
   - Complete job lifecycle management

3. **Profile Verification & Ratings**
   - Comprehensive profile creation
   - Verification system (email, phone, KYC-ready)
   - Job success score
   - Rating & review system
   - Special badges (Top Rated, Verified, Rising Talent)

4. **Global Payment System**
   - Multi-currency support
   - Integration-ready for 30+ payment gateways
   - Cards, wallets, mobile money, bank transfers
   - Crypto-ready architecture
   - Secure deposits, withdrawals, and transaction logs

5. **Communication & Management**
   - Real-time chat system (Socket.io ready)
   - Internal messaging per project
   - File sharing
   - Project tracking dashboard
   - Support desk & ticket system

6. **Multi-Role Dashboards**
   - Freelancer Dashboard
   - Buyer Dashboard
   - Admin Panel

7. **Admin Control & Analytics**
   - Full user management
   - Job & bid management
   - Payment & platform charge management
   - KYC & verification approvals
   - Analytics dashboard

8. **Security & Internationalization**
   - 2FA (Two-Factor Authentication)
   - OTP verification
   - Email & SMS alerts
   - GDPR-compliant data handling
   - Multi-language support (i18n-ready)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Fill in your database credentials and API keys

3. Set up the database:
```bash
cd backend
npm run migrate
```

4. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
freelancing-marketplace/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- 2FA support
- OTP verification
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 📝 License

ISC

