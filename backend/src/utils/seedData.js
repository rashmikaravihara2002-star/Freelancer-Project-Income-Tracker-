import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Income from '../models/Income.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB');

    // Clean existing collections
    await User.deleteMany();
    await Client.deleteMany();
    await Project.deleteMany();
    await Income.deleteMany();
    console.log('[Seeder] Cleared existing data');

    // 1. Create Demo User
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'demo@freelancer.com',
      password: 'password123',
      title: 'Senior Full Stack & UI/UX Freelancer',
      phone: '+1 (555) 234-5678',
      company: 'Apex Code Studio',
      address: '742 Evergreen Terrace, San Francisco, CA',
      bio: 'Crafting high-performance web applications and pixel-perfect digital experiences for startups and enterprise clients worldwide.',
      currency: 'USD',
    });
    console.log(`[Seeder] Created demo user: ${demoUser.email} (Password: password123)`);

    // 2. Create Clients
    const clientsData = [
      {
        userId: demoUser._id,
        name: 'Sarah Jenkins',
        email: 'sarah@fintechflow.io',
        phone: '+1 (415) 890-1234',
        company: 'FintechFlow Inc',
        address: '100 Market St, San Francisco, CA',
        website: 'https://fintechflow.io',
        notes: 'Fast-growing fintech startup. Prefers bi-weekly milestone check-ins.',
      },
      {
        userId: demoUser._id,
        name: 'David Zhang',
        email: 'david@cloudscale.ai',
        phone: '+1 (206) 555-7890',
        company: 'CloudScale AI',
        address: '500 Pike Street, Seattle, WA',
        website: 'https://cloudscale.ai',
        notes: 'AI analytics dashboard project. High priority enterprise client.',
      },
      {
        userId: demoUser._id,
        name: 'Elena Rostova',
        email: 'elena@luxevogue.com',
        phone: '+1 (212) 555-4321',
        company: 'Luxe Vogue Studio',
        address: '450 5th Avenue, New York, NY',
        website: 'https://luxevogue.com',
        notes: 'Fashion e-commerce revamp. Strict design aesthetics.',
      },
      {
        userId: demoUser._id,
        name: 'Marcus Brody',
        email: 'marcus@healthpulse.org',
        phone: '+1 (312) 555-9012',
        company: 'HealthPulse Labs',
        address: '222 N LaSalle St, Chicago, IL',
        website: 'https://healthpulse.org',
        notes: 'Telehealth patient portal frontend development.',
      },
      {
        userId: demoUser._id,
        name: 'Sophia Laurent',
        email: 'sophia@greenorbit.co',
        phone: '+1 (512) 555-6789',
        company: 'Green Orbit Energy',
        address: '301 Congress Ave, Austin, TX',
        website: 'https://greenorbit.co',
        notes: 'Solar monitoring IoT web application.',
      },
    ];

    const createdClients = await Client.insertMany(clientsData);
    console.log(`[Seeder] Created ${createdClients.length} clients`);

    // 3. Create Projects
    const projectsData = [
      {
        userId: demoUser._id,
        clientId: createdClients[0]._id, // FintechFlow
        projectName: 'FintechFlow Mobile & Web Banking Portal',
        description: 'Complete dashboard re-architecture with real-time crypto transactions and payment processing.',
        startDate: new Date('2026-08-01'),
        deadline: new Date('2026-10-30'),
        status: 'In Progress',
        fee: 8500,
        paidAmount: 5000,
        paymentStatus: 'Partially Paid',
        category: 'Web Development',
        priority: 'High',
      },
      {
        userId: demoUser._id,
        clientId: createdClients[1]._id, // CloudScale AI
        projectName: 'CloudScale AI Intelligence Suite',
        description: 'Custom ML visualization dashboards, prompt studio, and high-frequency model monitoring.',
        startDate: new Date('2026-07-15'),
        deadline: new Date('2026-11-15'),
        status: 'In Progress',
        fee: 12000,
        paidAmount: 6000,
        paymentStatus: 'Partially Paid',
        category: 'SaaS Platform',
        priority: 'Urgent',
      },
      {
        userId: demoUser._id,
        clientId: createdClients[2]._id, // Luxe Vogue
        projectName: 'Luxe Vogue E-Commerce Experience',
        description: 'Next-gen Shopify Plus custom headless storefront with 3D product previews and ultra-fast checkout.',
        startDate: new Date('2026-06-01'),
        deadline: new Date('2026-08-20'),
        status: 'Completed',
        fee: 6500,
        paidAmount: 6500,
        paymentStatus: 'Paid',
        category: 'E-Commerce',
        priority: 'Medium',
      },
      {
        userId: demoUser._id,
        clientId: createdClients[3]._id, // HealthPulse
        projectName: 'HealthPulse Telemedicine App',
        description: 'HIPAA compliant video consultation portal, appointment booking, and encrypted prescription handling.',
        startDate: new Date('2026-09-01'),
        deadline: new Date('2026-12-01'),
        status: 'In Progress',
        fee: 9800,
        paidAmount: 3000,
        paymentStatus: 'Partially Paid',
        category: 'Healthcare App',
        priority: 'High',
      },
      {
        userId: demoUser._id,
        clientId: createdClients[4]._id, // Green Orbit
        projectName: 'Green Orbit Energy Monitoring UI',
        description: 'Telemetry visualization dashboard displaying real-time kilowatt generation from solar panel clusters.',
        startDate: new Date('2026-09-20'),
        deadline: new Date('2026-10-25'),
        status: 'Pending',
        fee: 4500,
        paidAmount: 0,
        paymentStatus: 'Pending',
        category: 'UI/UX Design',
        priority: 'Medium',
      },
      {
        userId: demoUser._id,
        clientId: createdClients[0]._id, // FintechFlow
        projectName: 'Security Audit & Auth Refactor',
        description: 'Implementation of OAuth2, multi-factor hardware security key authentication, and audit logs.',
        startDate: new Date('2026-05-10'),
        deadline: new Date('2026-06-15'),
        status: 'Completed',
        fee: 3800,
        paidAmount: 3800,
        paymentStatus: 'Paid',
        category: 'Security & DevOps',
        priority: 'High',
      },
    ];

    const createdProjects = await Project.insertMany(projectsData);
    console.log(`[Seeder] Created ${createdProjects.length} projects`);

    // 4. Create Income Transactions
    const incomeData = [
      {
        userId: demoUser._id,
        projectId: createdProjects[0]._id,
        clientId: createdClients[0]._id,
        amount: 3000,
        paymentDate: new Date('2026-08-05'),
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: 'INV-2026-101',
        notes: 'Initial 35% deposit payment for FintechFlow Portal milestone 1',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[0]._id,
        clientId: createdClients[0]._id,
        amount: 2000,
        paymentDate: new Date('2026-09-12'),
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: 'INV-2026-102',
        notes: 'Milestone 2 frontend components delivery',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[0]._id,
        clientId: createdClients[0]._id,
        amount: 3500,
        paymentDate: new Date('2026-10-28'),
        paymentStatus: 'Pending',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: 'INV-2026-103',
        notes: 'Final milestone invoice upon staging launch',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[1]._id,
        clientId: createdClients[1]._id,
        amount: 6000,
        paymentDate: new Date('2026-07-20'),
        paymentStatus: 'Paid',
        paymentMethod: 'Stripe',
        invoiceNumber: 'INV-2026-104',
        notes: '50% project kickoff retainer for AI intelligence suite',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[1]._id,
        clientId: createdClients[1]._id,
        amount: 6000,
        paymentDate: new Date('2026-11-10'),
        paymentStatus: 'Pending',
        paymentMethod: 'Stripe',
        invoiceNumber: 'INV-2026-105',
        notes: 'Final milestone upon production deployment and training',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[2]._id,
        clientId: createdClients[2]._id,
        amount: 3250,
        paymentDate: new Date('2026-06-05'),
        paymentStatus: 'Paid',
        paymentMethod: 'PayPal',
        invoiceNumber: 'INV-2026-106',
        notes: 'First tranche for Luxe Vogue storefront redesign',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[2]._id,
        clientId: createdClients[2]._id,
        amount: 3250,
        paymentDate: new Date('2026-08-18'),
        paymentStatus: 'Paid',
        paymentMethod: 'PayPal',
        invoiceNumber: 'INV-2026-107',
        notes: 'Project completion final payment',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[3]._id,
        clientId: createdClients[3]._id,
        amount: 3000,
        paymentDate: new Date('2026-09-08'),
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: 'INV-2026-108',
        notes: 'Sprint 1 & Sprint 2 payment for HealthPulse',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[3]._id,
        clientId: createdClients[3]._id,
        amount: 6800,
        paymentDate: new Date('2026-11-28'),
        paymentStatus: 'Pending',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: 'INV-2026-109',
        notes: 'Remaining milestone balance for HIPAA video module',
      },
      {
        userId: demoUser._id,
        projectId: createdProjects[5]._id,
        clientId: createdClients[0]._id,
        amount: 3800,
        paymentDate: new Date('2026-06-12'),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        invoiceNumber: 'INV-2026-110',
        notes: 'Full payment for completed auth & security refactor',
      },
    ];

    const createdIncome = await Income.insertMany(incomeData);
    console.log(`[Seeder] Created ${createdIncome.length} income transactions`);

    console.log('[Seeder] Data Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
