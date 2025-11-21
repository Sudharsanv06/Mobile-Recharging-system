// backend/scripts/populateOperators.js
const mongoose = require('mongoose');
const Operator = require('../models/Operator');
require('dotenv').config();
const connectDB = require('../config/db');

const operators = [
  {
    name: 'Airtel',
    circle: 'All India',
    logo: 'airtel.png',
    type: 'prepaid',
    plans: [
      { planId: 'air-199', amount: 199, validity: '28 days', description: '1.5GB/day' },
      { planId: 'air-299', amount: 299, validity: '56 days', description: '2GB/day' },
    ],
  },
  {
    name: 'Jio',
    circle: 'All India',
    logo: 'jio.png',
    type: 'prepaid',
    plans: [
      { planId: 'jio-239', amount: 239, validity: '28 days', description: '2GB/day' },
      { planId: 'jio-349', amount: 349, validity: '56 days', description: '3GB/day' },
    ],
  },
  {
    name: 'Vi',
    circle: 'All India',
    logo: 'vi.png',
    type: 'prepaid',
    plans: [
      { planId: 'vi-149', amount: 149, validity: '28 days', description: '1GB/day' },
    ],
  },
  {
    name: 'BSNL',
    circle: 'All India',
    logo: 'bsnl.png',
    type: 'prepaid',
    plans: [
      { planId: 'bsnl-99', amount: 99, validity: '14 days', description: '500MB/day' },
    ],
  },
];

async function seed() {
  try {
    await connectDB();
    await Operator.deleteMany({});
    await Operator.insertMany(operators);
    console.log('Seeded operators');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();