const { sequelize } = require('../config/database');
const models = require('../models');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database migration completed successfully!');
    
    // Seed initial data
    await seedInitialData();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function seedInitialData() {
  try {
    const { Category, Skill } = models;
    
    // Seed categories
    const categories = [
      { name: 'Writing & Translation', slug: 'writing-translation', description: 'Content writing, translation, copywriting' },
      { name: 'Design & Creative', slug: 'design-creative', description: 'Graphic design, UI/UX, illustration' },
      { name: 'Development & IT', slug: 'development-it', description: 'Web development, software development, IT support' },
      { name: 'Marketing & Sales', slug: 'marketing-sales', description: 'Digital marketing, SEO, social media' },
      { name: 'Business & Consulting', slug: 'business-consulting', description: 'Business consulting, financial advice' },
      { name: 'Video & Animation', slug: 'video-animation', description: 'Video editing, animation, motion graphics' },
      { name: 'Music & Audio', slug: 'music-audio', description: 'Music production, audio editing, voiceover' },
      { name: 'Data Science & Analytics', slug: 'data-science-analytics', description: 'Data analysis, machine learning, AI' }
    ];

    for (const cat of categories) {
      await Category.findOrCreate({ where: { slug: cat.slug }, defaults: cat });
    }

    // Seed skills
    const skills = [
      { name: 'JavaScript', category: 'Development & IT' },
      { name: 'React', category: 'Development & IT' },
      { name: 'Node.js', category: 'Development & IT' },
      { name: 'Python', category: 'Development & IT' },
      { name: 'Graphic Design', category: 'Design & Creative' },
      { name: 'UI/UX Design', category: 'Design & Creative' },
      { name: 'Content Writing', category: 'Writing & Translation' },
      { name: 'SEO', category: 'Marketing & Sales' },
      { name: 'Social Media Marketing', category: 'Marketing & Sales' }
    ];

    for (const skill of skills) {
      await Skill.findOrCreate({ where: { name: skill.name }, defaults: skill });
    }

    console.log('✅ Initial data seeded successfully!');
  } catch (error) {
    console.error('⚠️  Seeding error:', error);
  }
}

migrate();

