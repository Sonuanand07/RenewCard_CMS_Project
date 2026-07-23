require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Page = require('../models/Page');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Page.deleteMany({});

    // Create admin users
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@renewcred.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const editor = await Admin.create({
      username: 'editor',
      email: 'editor@renewcred.com',
      password: 'Editor@123',
      role: 'editor',
    });

    console.log('✓ Admins created');

    // Create sample pages
    const homePage = await Page.create({
      title: 'Home',
      slug: 'home',
      description: 'Welcome to RenewCred',
      blocks: [
        {
          type: 'header',
          data: { text: 'Welcome to RenewCred' },
          order: 0,
        },
        {
          type: 'paragraph',
          data: { text: 'Build your credit with confidence. Our platform helps you understand and improve your credit score.' },
          order: 1,
        },
        {
          type: 'richtext',
          data: {
            html: '<p>RenewCred is a trusted platform for credit management and financial wellness.</p>',
          },
          order: 2,
        },
      ],
      status: 'published',
      createdBy: admin._id,
      publishedBy: admin._id,
      publishedAt: new Date(),
    });

    const aboutPage = await Page.create({
      title: 'About Us',
      slug: 'about',
      description: 'Learn more about RenewCred',
      blocks: [
        {
          type: 'header',
          data: { text: 'About RenewCred' },
          order: 0,
        },
        {
          type: 'paragraph',
          data: { text: 'We are dedicated to helping individuals improve their financial health.' },
          order: 1,
        },
        {
          type: 'list',
          data: {
            items: [
              'Free credit monitoring',
              'Personalized recommendations',
              'Expert support available 24/7',
              'Secure and trusted platform',
            ],
          },
          order: 2,
        },
      ],
      status: 'published',
      createdBy: admin._id,
      publishedBy: admin._id,
      publishedAt: new Date(),
    });

    const featurePage = await Page.create({
      title: 'Features',
      slug: 'features',
      description: 'Discover our features',
      blocks: [
        {
          type: 'header',
          data: { text: 'Our Features' },
          order: 0,
        },
        {
          type: 'table',
          data: {
            headers: ['Feature', 'Free Plan', 'Premium Plan'],
            rows: [
              ['Credit Score Monitoring', '✓', '✓'],
              ['Credit Report Access', 'Limited', 'Full'],
              ['Personalized Recommendations', '✓', '✓'],
              ['Priority Support', '✗', '✓'],
              ['Identity Theft Protection', '✗', '✓'],
            ],
          },
          order: 1,
        },
      ],
      status: 'published',
      createdBy: admin._id,
      publishedBy: admin._id,
      publishedAt: new Date(),
    });

    console.log('✓ Pages created');

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('\nAdmin Credentials:');
    console.log('  Email: admin@renewcred.com');
    console.log('  Password: Admin@123');
    console.log('\nEditor Credentials:');
    console.log('  Email: editor@renewcred.com');
    console.log('  Password: Editor@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
