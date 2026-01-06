# Demo Data Guide

## ✅ Demo Data Successfully Created!

Comprehensive demo data has been added to all sections of the application for testing purposes.

## 📊 Demo Data Summary

### 👥 Users (7 total)
- **2 Buyers**
  - buyer1@demo.com / demo123
  - buyer2@demo.com / demo123

- **3 Freelancers**
  - freelancer1@demo.com / demo123 (Full-stack Developer)
  - freelancer2@demo.com / demo123 (UI/UX Designer)
  - freelancer3@demo.com / demo123 (Content Writer)

- **1 Demo Buyer** (from seed-jobs)
  - demo@buyer.com / demo123

### 📋 Jobs (11 total)
- Full Stack Web Developer - E-commerce Platform ($5,000)
- UI/UX Designer - Mobile App Redesign ($2,500)
- Content Writer - Tech Blog ($1,500)
- Social Media Marketing ($3,000)
- Python Developer - Data Analysis ($3,500/hourly)
- Logo Design ($800)
- Technical Documentation ($2,000)
- SEO Specialist ($1,800)
- WordPress Developer ($2,200)
- Video Editor ($1,200)
- Business Strategy Consultant ($4,000/hourly)

### 💼 Bids (4 total)
- Multiple bids on different jobs
- Mix of pending and accepted bids
- Different freelancers bidding

### 📝 Contracts (2 total)
- 1 Active contract with milestones
- 1 Completed contract (for reviews)

### 🎯 Milestones (3 total)
- Design Phase (30% of contract)
- Development Phase (50% of contract)
- Testing & Delivery (20% of contract)

### ⭐ Reviews (2 total)
- Buyer reviews for freelancer
- Freelancer reviews for buyer
- 5-star ratings with comments

### 💬 Messages (3 total)
- Conversation between buyer and freelancer
- Related to active contract
- Mix of read and unread messages

### 🎨 Skills Assigned
- **Freelancer 1**: JavaScript, React, Node.js, Python
- **Freelancer 2**: Graphic Design, UI/UX Design
- **Freelancer 3**: Content Writing, SEO

## 🔑 Login Credentials

### Buyers
```
Email: buyer1@demo.com
Password: demo123

Email: buyer2@demo.com
Password: demo123
```

### Freelancers
```
Email: freelancer1@demo.com
Password: demo123
Role: Full-stack Developer
Rating: 4.8/5
Earnings: $45,000

Email: freelancer2@demo.com
Password: demo123
Role: UI/UX Designer
Rating: 4.9/5
Earnings: $38,000

Email: freelancer3@demo.com
Password: demo123
Role: Content Writer
Rating: 4.7/5
Earnings: $22,000
```

## 🧪 Testing Scenarios

### As a Buyer:
1. **View Jobs**: Browse all 11 demo jobs
2. **View Bids**: See bids on your posted jobs
3. **Accept Bids**: Accept a bid to create a contract
4. **Manage Contracts**: View active contracts with milestones
5. **Send Messages**: Communicate with freelancers
6. **Leave Reviews**: Review completed projects

### As a Freelancer:
1. **Browse Jobs**: See all available jobs
2. **Place Bids**: Submit bids on jobs
3. **View My Bids**: Check status of your bids
4. **Manage Contracts**: View active contracts
5. **Track Milestones**: See milestone progress
6. **View Messages**: Check conversations
7. **View Reviews**: See ratings and feedback

### As Admin:
1. **Dashboard**: View analytics and stats
2. **User Management**: Manage all users
3. **Job Management**: Oversee all jobs
4. **Contract Management**: Monitor contracts
5. **Support Tickets**: Handle support requests

## 🔄 Re-seed Demo Data

To reset or add more demo data:

```bash
cd backend
npm run seed-demo
```

This script is safe to run multiple times - it checks for existing data and won't create duplicates.

## 📝 Notes

- All demo users have verified emails
- Freelancers have complete profiles with ratings
- Jobs have realistic descriptions and requirements
- Contracts include milestone breakdowns
- Reviews are realistic and helpful
- Messages show proper conversation flow

## 🎯 Quick Test Checklist

- [ ] Login as buyer1@demo.com
- [ ] View jobs page - see 11 jobs
- [ ] View a job detail - see bids
- [ ] Login as freelancer1@demo.com
- [ ] View "My Bids" - see placed bids
- [ ] View contracts - see active contract
- [ ] View messages - see conversation
- [ ] View profile - see ratings and earnings
- [ ] Login as buyer - accept a bid
- [ ] View contract with milestones

Enjoy testing! 🚀

