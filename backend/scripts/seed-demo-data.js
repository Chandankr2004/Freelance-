const { sequelize } = require('../config/database');
const { User, Profile, Job, Bid, Contract, Milestone, Review, Message, Category, Skill } = require('../models');
require('dotenv').config();

async function seedDemoData() {
  try {
    console.log('🌱 Seeding comprehensive demo data...\n');

    // Get categories
    const categories = await Category.findAll();
    if (categories.length === 0) {
      console.log('❌ No categories found. Please run migrations first.');
      process.exit(1);
    }

    // Create demo users
    console.log('👥 Creating demo users...');
    
    const demoUsers = [
      {
        email: 'buyer1@demo.com',
        password: 'demo123',
        role: 'buyer',
        isEmailVerified: true,
        profile: {
          firstName: 'John',
          lastName: 'Smith',
          displayName: 'John Smith',
          location: 'New York, USA',
          bio: 'Tech entrepreneur looking for talented freelancers to help build amazing products.',
          companyName: 'TechStart Inc.'
        }
      },
      {
        email: 'buyer2@demo.com',
        password: 'demo123',
        role: 'buyer',
        isEmailVerified: true,
        profile: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          displayName: 'Sarah Johnson',
          location: 'London, UK',
          bio: 'Marketing director seeking creative professionals for various projects.',
          companyName: 'Marketing Pro'
        }
      },
      {
        email: 'freelancer1@demo.com',
        password: 'demo123',
        role: 'freelancer',
        isEmailVerified: true,
        profile: {
          firstName: 'Alex',
          lastName: 'Chen',
          displayName: 'Alex Chen',
          location: 'San Francisco, USA',
          bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.',
          hourlyRate: 75,
          currency: 'USD',
          rating: 4.8,
          totalReviews: 24,
          jobSuccessScore: 95,
          totalEarnings: 45000,
          totalJobs: 18,
          badges: ['Top Rated', 'Verified'],
          availability: 'available'
        }
      },
      {
        email: 'freelancer2@demo.com',
        password: 'demo123',
        role: 'freelancer',
        isEmailVerified: true,
        profile: {
          firstName: 'Emma',
          lastName: 'Williams',
          displayName: 'Emma Williams',
          location: 'Toronto, Canada',
          bio: 'UI/UX designer specializing in mobile app design and user experience optimization.',
          hourlyRate: 60,
          currency: 'USD',
          rating: 4.9,
          totalReviews: 31,
          jobSuccessScore: 98,
          totalEarnings: 38000,
          totalJobs: 22,
          badges: ['Top Rated', 'Rising Talent'],
          availability: 'available'
        }
      },
      {
        email: 'freelancer3@demo.com',
        password: 'demo123',
        role: 'freelancer',
        isEmailVerified: true,
        profile: {
          firstName: 'Michael',
          lastName: 'Brown',
          displayName: 'Michael Brown',
          location: 'Sydney, Australia',
          bio: 'Content writer and SEO specialist with expertise in tech and business content.',
          hourlyRate: 45,
          currency: 'USD',
          rating: 4.7,
          totalReviews: 15,
          jobSuccessScore: 92,
          totalEarnings: 22000,
          totalJobs: 12,
          badges: ['Verified'],
          availability: 'available'
        }
      }
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const { profile, ...userInfo } = userData;
      let user = await User.findOne({ where: { email: userInfo.email } });
      
      if (!user) {
        user = await User.create(userInfo);
        await Profile.create({
          userId: user.id,
          ...profile
        });
        console.log(`  ✅ Created ${userInfo.role}: ${userInfo.email}`);
      } else {
        console.log(`  ℹ️  User already exists: ${userInfo.email}`);
      }
      createdUsers.push(user);
    }

    // Get jobs
    console.log('\n📋 Getting jobs...');
    const jobs = await Job.findAll({ limit: 5 });
    if (jobs.length === 0) {
      console.log('  ⚠️  No jobs found. Run seed-jobs first.');
    }

    // Create demo bids
    console.log('\n💼 Creating demo bids...');
    const buyers = createdUsers.filter(u => u.role === 'buyer');
    const freelancers = createdUsers.filter(u => u.role === 'freelancer');

    if (jobs.length > 0 && freelancers.length > 0) {
      const bidData = [
        {
          jobId: jobs[0].id,
          freelancerId: freelancers[0].id,
          amount: 4500,
          currency: 'USD',
          deliveryTime: 50,
          deliveryUnit: 'days',
          proposal: 'I have extensive experience building e-commerce platforms. I can deliver a scalable solution using React and Node.js with proper payment integration and admin dashboard.',
          status: 'pending'
        },
        {
          jobId: jobs[0].id,
          freelancerId: freelancers[1].id,
          amount: 4800,
          currency: 'USD',
          deliveryTime: 55,
          deliveryUnit: 'days',
          proposal: 'I specialize in full-stack development and have completed similar projects. I can provide regular updates and ensure code quality.',
          status: 'pending'
        },
        {
          jobId: jobs[1].id,
          freelancerId: freelancers[1].id,
          amount: 2300,
          currency: 'USD',
          deliveryTime: 25,
          deliveryUnit: 'days',
          proposal: 'As a UI/UX designer, I can redesign your mobile app with a modern, user-friendly interface. I will conduct user research and create prototypes.',
          status: 'accepted'
        },
        {
          jobId: jobs[2].id,
          freelancerId: freelancers[2].id,
          amount: 1400,
          currency: 'USD',
          deliveryTime: 40,
          deliveryUnit: 'days',
          proposal: 'I am a professional content writer with expertise in tech blogs. I can deliver SEO-optimized, well-researched articles that engage readers.',
          status: 'pending'
        }
      ];

      for (const bidInfo of bidData) {
        const existing = await Bid.findOne({
          where: {
            jobId: bidInfo.jobId,
            freelancerId: bidInfo.freelancerId
          }
        });

        if (!existing) {
          await Bid.create(bidInfo);
          // Update job bids count
          const job = await Job.findByPk(bidInfo.jobId);
          if (job) {
            job.bidsCount = (job.bidsCount || 0) + 1;
            if (job.status === 'posted') {
              job.status = 'bidding';
            }
            await job.save();
          }
          console.log(`  ✅ Created bid for job ${bidInfo.jobId}`);
        }
      }
    }

    // Create demo contracts
    console.log('\n📝 Creating demo contracts...');
    if (jobs.length > 0 && buyers.length > 0 && freelancers.length > 0) {
      const acceptedBid = await Bid.findOne({
        where: { status: 'accepted' },
        include: [{ model: Job, as: 'job' }]
      });

      if (acceptedBid) {
        const existingContract = await Contract.findOne({
          where: { jobId: acceptedBid.jobId }
        });

        if (!existingContract) {
          const platformFeePercent = 10;
          const platformFee = (acceptedBid.amount * platformFeePercent) / 100;
          const freelancerAmount = acceptedBid.amount - platformFee;

          const contract = await Contract.create({
            jobId: acceptedBid.jobId,
            buyerId: acceptedBid.job.buyerId,
            freelancerId: acceptedBid.freelancerId,
            title: acceptedBid.job.title,
            description: acceptedBid.job.description,
            totalAmount: acceptedBid.amount,
            currency: acceptedBid.currency,
            platformFee,
            freelancerAmount,
            contractType: acceptedBid.job.budgetType,
            status: 'active',
            paymentStatus: 'escrowed',
            escrowAmount: acceptedBid.amount,
            startDate: new Date(),
            endDate: new Date(Date.now() + acceptedBid.deliveryTime * 24 * 60 * 60 * 1000)
          });

          // Create milestones
          await Milestone.create({
            contractId: contract.id,
            title: 'Design Phase',
            description: 'Complete UI/UX design and get approval',
            amount: contract.totalAmount * 0.3,
            currency: contract.currency,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'in_progress',
            order: 1
          });

          await Milestone.create({
            contractId: contract.id,
            title: 'Development Phase',
            description: 'Implement core features',
            amount: contract.totalAmount * 0.5,
            currency: contract.currency,
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            status: 'pending',
            order: 2
          });

          await Milestone.create({
            contractId: contract.id,
            title: 'Testing & Delivery',
            description: 'Final testing and project delivery',
            amount: contract.totalAmount * 0.2,
            currency: contract.currency,
            dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            status: 'pending',
            order: 3
          });

          // Update job status
          const job = await Job.findByPk(acceptedBid.jobId);
          if (job) {
            job.status = 'hired';
            job.hiredFreelancerId = acceptedBid.freelancerId;
            await job.save();
          }

          console.log(`  ✅ Created contract with 3 milestones`);
        }
      }
    }

    // Create demo reviews
    console.log('\n⭐ Creating demo reviews...');
    const contracts = await Contract.findAll({
      where: { status: 'completed' },
      limit: 3
    });

    if (contracts.length === 0) {
      // Create a completed contract for reviews
      if (jobs.length > 0 && buyers.length > 0 && freelancers.length > 0) {
        const completedContract = await Contract.create({
          jobId: jobs[3]?.id || jobs[0].id,
          buyerId: buyers[0].id,
          freelancerId: freelancers[0].id,
          title: 'Completed Project',
          description: 'This was a completed project for demo purposes',
          totalAmount: 2000,
          currency: 'USD',
          platformFee: 200,
          freelancerAmount: 1800,
          contractType: 'fixed',
          status: 'completed',
          paymentStatus: 'released',
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        });

        // Create reviews
        await Review.create({
          contractId: completedContract.id,
          reviewerId: buyers[0].id,
          revieweeId: freelancers[0].id,
          rating: 5,
          comment: 'Excellent work! Very professional and delivered on time. Highly recommended.',
          categories: { communication: 5, quality: 5, timeliness: 5 }
        });

        await Review.create({
          contractId: completedContract.id,
          reviewerId: freelancers[0].id,
          revieweeId: buyers[0].id,
          rating: 5,
          comment: 'Great client to work with. Clear communication and prompt payments.',
          categories: { communication: 5, payment: 5 }
        });

        console.log(`  ✅ Created 2 demo reviews`);
      }
    } else {
      for (const contract of contracts) {
        const existingReview = await Review.findOne({
          where: { contractId: contract.id }
        });

        if (!existingReview) {
          await Review.create({
            contractId: contract.id,
            reviewerId: contract.buyerId,
            revieweeId: contract.freelancerId,
            rating: 5,
            comment: 'Great work! Very satisfied with the results.',
            categories: { communication: 5, quality: 5 }
          });
        }
      }
      console.log(`  ✅ Created reviews for existing contracts`);
    }

    // Create demo messages
    console.log('\n💬 Creating demo messages...');
    if (buyers.length > 0 && freelancers.length > 0) {
      const contracts = await Contract.findAll({ limit: 2 });
      
      if (contracts.length > 0) {
        const contract = contracts[0];
        const messages = [
          {
            senderId: contract.buyerId,
            receiverId: contract.freelancerId,
            contractId: contract.id,
            content: 'Hi! I wanted to discuss the project requirements in detail.',
            isRead: true
          },
          {
            senderId: contract.freelancerId,
            receiverId: contract.buyerId,
            contractId: contract.id,
            content: 'Hello! I\'m ready to start. Could you share more details about the design preferences?',
            isRead: true
          },
          {
            senderId: contract.buyerId,
            receiverId: contract.freelancerId,
            contractId: contract.id,
            content: 'Sure! I prefer a modern, minimalist design with a focus on user experience.',
            isRead: false
          }
        ];

        for (const msg of messages) {
          const existing = await Message.findOne({
            where: {
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              contractId: msg.contractId,
              content: msg.content
            }
          });

          if (!existing) {
            await Message.create(msg);
          }
        }
        console.log(`  ✅ Created demo messages for contract`);
      }
    }

    // Assign skills to freelancers
    console.log('\n🎯 Assigning skills to freelancers...');
    const allSkills = await Skill.findAll();
    
    if (allSkills.length > 0 && freelancers.length > 0) {
      const skillAssignments = [
        { freelancer: freelancers[0], skills: ['JavaScript', 'React', 'Node.js', 'Python'] },
        { freelancer: freelancers[1], skills: ['Graphic Design', 'UI/UX Design'] },
        { freelancer: freelancers[2], skills: ['Content Writing', 'SEO'] }
      ];

      for (const assignment of skillAssignments) {
        const profile = await Profile.findOne({ where: { userId: assignment.freelancer.id } });
        if (profile) {
          const skillsToAssign = allSkills.filter(s => 
            assignment.skills.includes(s.name)
          );
          await profile.setSkills(skillsToAssign);
          console.log(`  ✅ Assigned skills to ${assignment.freelancer.email}`);
        }
      }
    }

    console.log('\n✅ Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${await User.count()}`);
    console.log(`   - Jobs: ${await Job.count()}`);
    console.log(`   - Bids: ${await Bid.count()}`);
    console.log(`   - Contracts: ${await Contract.count()}`);
    console.log(`   - Reviews: ${await Review.count()}`);
    console.log(`   - Messages: ${await Message.count()}`);
    console.log(`   - Milestones: ${await Milestone.count()}`);
    
    console.log('\n🔑 Demo Login Credentials:');
    console.log('   Buyers:');
    console.log('   - buyer1@demo.com / demo123');
    console.log('   - buyer2@demo.com / demo123');
    console.log('   Freelancers:');
    console.log('   - freelancer1@demo.com / demo123');
    console.log('   - freelancer2@demo.com / demo123');
    console.log('   - freelancer3@demo.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

seedDemoData();

