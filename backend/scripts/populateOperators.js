const mongoose = require('mongoose');
const Operator = require('../models/Operator');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

const operators = [
  {
    name: 'Jio',
    logo: 'reliance-jio-logo-1.svg',
    plans: [
      { amount: 149, validity: '20 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular starter pack' },
      { amount: 239, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most popular choice' },
      { amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Great value for money' },
      { amount: 155, validity: '24 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Light data users' },
      { amount: 479, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity offer' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 329, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'JioTV + JioCinema' },
      { amount: 449, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All Jio apps included' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment bundle' },
      { amount: 899, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium movie package' },
      { amount: 279, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'JioTV Sports + Live Cricket' },
      { amount: 449, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports bundle with extra data' },
      { amount: 649, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' },
      { amount: 349, validity: '28 days', data: '2.5GB/day + True 5G', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 5G' },
      { amount: 549, validity: '28 days', data: '3GB/day + True 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' },
      { amount: 1899, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 2999, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 4199, validity: '365 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 5G' },
      { amount: 2899, validity: '30 days', data: '100GB', calls: '200 mins', sms: '100', description: 'International roaming - Asia' },
      { amount: 5751, validity: '30 days', data: '200GB', calls: '500 mins', sms: '200', description: 'International roaming - USA/UK' },
      { amount: 1299, validity: '7 days', data: '20GB', calls: '100 mins', sms: '50', description: 'Short trip international' },
      { amount: 8999, validity: '30 days', data: '500GB', calls: '1000 mins', sms: '500', description: 'Premium global roaming' }
    ]
  },
  {
    name: 'Airtel',
    logo: 'airtel-logo.svg',
    plans: [
      { amount: 149, validity: '20 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular starter pack' },
      { amount: 239, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most popular choice' },
      { amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Great value for money' },
      { amount: 155, validity: '24 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Light data users' },
      { amount: 479, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity offer' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 329, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Airtel TV + Wynk Music' },
      { amount: 449, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All Airtel apps included' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment bundle' },
      { amount: 899, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium movie package' },
      { amount: 279, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Airtel TV Sports + Live Cricket' },
      { amount: 449, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports bundle with extra data' },
      { amount: 649, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' },
      { amount: 349, validity: '28 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 5G' },
      { amount: 549, validity: '28 days', data: '3GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' },
      { amount: 1899, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 2999, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 4199, validity: '365 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 5G' },
      { amount: 2899, validity: '30 days', data: '100GB', calls: '200 mins', sms: '100', description: 'International roaming - Asia' },
      { amount: 5751, validity: '30 days', data: '200GB', calls: '500 mins', sms: '200', description: 'International roaming - USA/UK' },
      { amount: 1299, validity: '7 days', data: '20GB', calls: '100 mins', sms: '50', description: 'Short trip international' },
      { amount: 8999, validity: '30 days', data: '500GB', calls: '1000 mins', sms: '500', description: 'Premium global roaming' }
    ]
  },
  {
    name: 'Vi',
    logo: 'vi-vodafone-idea.svg',
    plans: [
      { amount: 149, validity: '20 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular starter pack' },
      { amount: 239, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most popular choice' },
      { amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Great value for money' },
      { amount: 155, validity: '24 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Light data users' },
      { amount: 479, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity offer' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 329, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Movies + Vi Music' },
      { amount: 449, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All Vi apps included' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment bundle' },
      { amount: 899, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium movie package' },
      { amount: 279, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Sports + Live Cricket' },
      { amount: 449, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports bundle with extra data' },
      { amount: 649, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' },
      { amount: 349, validity: '28 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 5G' },
      { amount: 549, validity: '28 days', data: '3GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' },
      { amount: 1899, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 2999, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 4199, validity: '365 days', data: '2.5GB/day + 5G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 5G' },
      { amount: 2899, validity: '30 days', data: '100GB', calls: '200 mins', sms: '100', description: 'International roaming - Asia' },
      { amount: 5751, validity: '30 days', data: '200GB', calls: '500 mins', sms: '200', description: 'International roaming - USA/UK' },
      { amount: 1299, validity: '7 days', data: '20GB', calls: '100 mins', sms: '50', description: 'Short trip international' },
      { amount: 8999, validity: '30 days', data: '500GB', calls: '1000 mins', sms: '500', description: 'Premium global roaming' }
    ]
  },
  {
    name: 'BSNL',
    logo: 'bsnl-logo.svg',
    plans: [
      { amount: 149, validity: '20 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular starter pack' },
      { amount: 239, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most popular choice' },
      { amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Great value for money' },
      { amount: 155, validity: '24 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic unlimited pack' },
      { amount: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Light data users' },
      { amount: 479, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Double validity offer' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited calls' },
      { amount: 329, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'BSNL TV + BSNL Music' },
      { amount: 449, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All BSNL apps included' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete entertainment bundle' },
      { amount: 899, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium movie package' },
      { amount: 279, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'BSNL Sports + Live Cricket' },
      { amount: 449, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Sports bundle with extra data' },
      { amount: 649, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' },
      { amount: 349, validity: '28 days', data: '2.5GB/day + 4G', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with 4G' },
      { amount: 549, validity: '28 days', data: '3GB/day + 4G', calls: 'Unlimited', sms: '100/day', description: 'Ultra monthly pack' },
      { amount: 1899, validity: '365 days', data: '24GB', calls: '3600 mins', sms: '100/day', description: 'Basic yearly pack' },
      { amount: 2999, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      { amount: 4199, validity: '365 days', data: '2.5GB/day + 4G', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly with 4G' },
      { amount: 2899, validity: '30 days', data: '100GB', calls: '200 mins', sms: '100', description: 'International roaming - Asia' },
      { amount: 5751, validity: '30 days', data: '200GB', calls: '500 mins', sms: '200', description: 'International roaming - USA/UK' },
      { amount: 1299, validity: '7 days', data: '20GB', calls: '100 mins', sms: '50', description: 'Short trip international' },
      { amount: 8999, validity: '30 days', data: '500GB', calls: '1000 mins', sms: '500', description: 'Premium global roaming' }
    ]
  }
];

const populateOperators = async () => {
  try {
    await connectDB();
    
    // Clear existing operators
    await Operator.deleteMany({});
    console.log('Cleared existing operators');
    
    // Insert new operators
    const result = await Operator.insertMany(operators);
    console.log(`Successfully populated ${result.length} operators with their plans`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error populating operators:', error);
    process.exit(1);
  }
};

populateOperators(); 