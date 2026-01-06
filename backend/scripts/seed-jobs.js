const { sequelize } = require('../config/database');
const { Job, User, Category } = require('../models');
require('dotenv').config();

async function seedJobs() {
  try {
    console.log('🌱 Seeding demo jobs...');

    // Get categories
    const categories = await Category.findAll();
    if (categories.length === 0) {
      console.log('❌ No categories found. Please run migrations first.');
      process.exit(1);
    }

    // Get or create a demo buyer user
    let buyer = await User.findOne({ where: { email: 'demo@buyer.com' } });
    if (!buyer) {
      buyer = await User.create({
        email: 'demo@buyer.com',
        password: 'demo123',
        role: 'buyer',
        isEmailVerified: true
      });
      console.log('✅ Created demo buyer user');
    }

    // Sample jobs data
    const jobs = [
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'development-it')?.id || categories[0].id,
        title: 'Full Stack Web Developer Needed for E-commerce Platform',
        description: 'We are looking for an experienced full-stack developer to build a modern e-commerce platform. The project requires expertise in React.js, Node.js, and PostgreSQL. You will be responsible for developing both frontend and backend components, integrating payment gateways, and ensuring the platform is scalable and secure.',
        skills: ['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'RESTful APIs'],
        budget: 5000,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 60,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'design-creative')?.id || categories[0].id,
        title: 'UI/UX Designer for Mobile App Redesign',
        description: 'We need a talented UI/UX designer to redesign our mobile application. The app currently has usability issues and needs a modern, user-friendly interface. You should have experience with mobile app design, user research, and prototyping tools like Figma or Adobe XD.',
        skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'User Research'],
        budget: 2500,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 30,
        durationUnit: 'days',
        status: 'bidding',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'writing-translation')?.id || categories[0].id,
        title: 'Content Writer for Tech Blog - 20 Articles',
        description: 'Looking for an experienced tech content writer to create 20 high-quality blog articles about web development, programming, and technology trends. Articles should be SEO-optimized, well-researched, and engaging. Each article should be 1500-2000 words.',
        skills: ['Content Writing', 'SEO', 'Technical Writing', 'Blog Writing'],
        budget: 1500,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 45,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'marketing-sales')?.id || categories[0].id,
        title: 'Social Media Marketing Specialist - 3 Month Campaign',
        description: 'We need a social media marketing expert to manage our Instagram, Facebook, and LinkedIn accounts for 3 months. Responsibilities include content creation, posting schedule, engagement with followers, and running paid ad campaigns. Experience with social media analytics is required.',
        skills: ['Social Media Marketing', 'Content Creation', 'Facebook Ads', 'Instagram Marketing'],
        budget: 3000,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 90,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'development-it')?.id || categories[0].id,
        title: 'Python Developer for Data Analysis Project',
        description: 'Seeking a Python developer with experience in data analysis and machine learning. The project involves analyzing large datasets, creating visualizations, and building predictive models. Knowledge of pandas, numpy, matplotlib, and scikit-learn is essential.',
        skills: ['Python', 'Data Analysis', 'Machine Learning', 'Pandas', 'NumPy'],
        budget: 3500,
        currency: 'USD',
        budgetType: 'hourly',
        duration: 40,
        durationUnit: 'days',
        status: 'bidding',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'design-creative')?.id || categories[0].id,
        title: 'Logo Design and Brand Identity Package',
        description: 'We are launching a new startup and need a complete brand identity package. This includes logo design, color palette, typography selection, and brand guidelines document. The design should be modern, professional, and suitable for a tech company.',
        skills: ['Logo Design', 'Brand Identity', 'Graphic Design', 'Adobe Illustrator'],
        budget: 800,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 14,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'writing-translation')?.id || categories[0].id,
        title: 'Technical Documentation Writer - API Documentation',
        description: 'Need an experienced technical writer to create comprehensive API documentation for our REST API. Documentation should include endpoints, request/response examples, authentication methods, and code samples in multiple programming languages.',
        skills: ['Technical Writing', 'API Documentation', 'Markdown', 'OpenAPI'],
        budget: 2000,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 21,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'marketing-sales')?.id || categories[0].id,
        title: 'SEO Specialist - Website Optimization',
        description: 'Looking for an SEO expert to optimize our website for search engines. Tasks include keyword research, on-page optimization, technical SEO audit, backlink building strategy, and monthly reporting. Experience with Google Analytics and Search Console required.',
        skills: ['SEO', 'Keyword Research', 'Google Analytics', 'Link Building'],
        budget: 1800,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 60,
        durationUnit: 'days',
        status: 'bidding',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'development-it')?.id || categories[0].id,
        title: 'WordPress Developer - Custom Theme Development',
        description: 'We need a WordPress developer to create a custom theme for our business website. The theme should be responsive, SEO-friendly, and include custom post types and advanced custom fields. Experience with PHP, HTML, CSS, and JavaScript is required.',
        skills: ['WordPress', 'PHP', 'CSS', 'JavaScript', 'Theme Development'],
        budget: 2200,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 35,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'video-animation')?.id || categories[0].id,
        title: 'Video Editor for YouTube Channel - 10 Videos',
        description: 'Looking for a skilled video editor to edit 10 YouTube videos for our channel. Videos are about 10-15 minutes each. Tasks include cutting, color correction, adding graphics, transitions, and background music. Experience with Adobe Premiere Pro or Final Cut Pro required.',
        skills: ['Video Editing', 'Adobe Premiere Pro', 'Color Grading', 'Motion Graphics'],
        budget: 1200,
        currency: 'USD',
        budgetType: 'fixed',
        duration: 30,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        buyerId: buyer.id,
        categoryId: categories.find(c => c.slug === 'business-consulting')?.id || categories[0].id,
        title: 'Business Strategy Consultant - Startup Advisory',
        description: 'We are a tech startup looking for an experienced business consultant to help with market analysis, business model development, and go-to-market strategy. You should have experience working with tech startups and a strong understanding of SaaS business models.',
        skills: ['Business Strategy', 'Market Analysis', 'Business Planning', 'Startup Advisory'],
        budget: 4000,
        currency: 'USD',
        budgetType: 'hourly',
        duration: 60,
        durationUnit: 'days',
        status: 'posted',
        location: 'Remote',
        isRemote: true,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ];

    // Create jobs
    let created = 0;
    for (const jobData of jobs) {
      const existingJob = await Job.findOne({
        where: {
          title: jobData.title,
          buyerId: jobData.buyerId
        }
      });

      if (!existingJob) {
        await Job.create(jobData);
        created++;
      }
    }

    console.log(`✅ Successfully created ${created} demo jobs`);
    console.log(`ℹ️  ${jobs.length - created} jobs already existed`);

    // Display summary
    const totalJobs = await Job.count();
    console.log(`\n📊 Total jobs in database: ${totalJobs}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();

