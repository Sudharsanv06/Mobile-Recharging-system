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
      // Recommended Plans
      { amount: 149, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value prepaid plan with unlimited calls' },
      { amount: 199, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular plan with extra data and Disney+ Hotstar Mobile' },
      { amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium plan with unlimited 5G data and streaming benefits' },
      { amount: 399, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'High-speed data with Amazon Prime for 1 month' },
      { amount: 599, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity with unlimited 5G and OTT benefits' },
      
      // Unlimited Plans
      { amount: 155, validity: '24 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Truly unlimited calling with daily data' },
      { amount: 179, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly unlimited voice and data' },
      { amount: 265, validity: '30 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'FUP free unlimited voice and high-speed data' },
      { amount: 549, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long-term unlimited with 5G access' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Quarterly unlimited plan with Disney+ Hotstar' },
      
      // Movie & Entertainment Plans
      { amount: 359, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Netflix Mobile + Disney+ Hotstar included' },
      { amount: 499, validity: '28 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Amazon Prime Video + Sony LIV premium access' },
      { amount: 699, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'All OTT apps including Netflix, Prime, Hotstar' },
      { amount: 839, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar Premium for 3 months' },
      { amount: 999, validity: '84 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate entertainment bundle with all streaming apps' },
      
      // Cricket Special Plans
      { amount: 289, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar for live cricket streaming' },
      { amount: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Watch all cricket matches on Hotstar VIP' },
      { amount: 789, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season with Hotstar Premium' },
      
      // Monthly Plans
      { amount: 249, validity: '30 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly recharge' },
      { amount: 349, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly plan with extra data' },
      { amount: 479, validity: '30 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'High-speed monthly plan' },
      
      // Yearly Plans
      { amount: 1799, validity: '365 days', data: '24GB', calls: 'Unlimited', sms: '3600', description: 'Annual plan with Disney+ Hotstar for 1 year' },
      { amount: 2399, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly plan with unlimited 5G' },
      { amount: 2999, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly plan with all OTT subscriptions' },
      { amount: 3599, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'VIP yearly plan with priority customer service' },
      
      // International Roaming
      { amount: 2999, validity: '28 days', data: '5GB', calls: '500 mins', sms: '100', description: 'USA & Canada roaming pack' },
      { amount: 3999, validity: '28 days', data: '8GB', calls: '1000 mins', sms: '100', description: 'Europe roaming with unlimited data' },
      { amount: 4999, validity: '30 days', data: '10GB', calls: 'Unlimited', sms: '200', description: 'Premium global roaming for all countries' },
      { amount: 5999, validity: '30 days', data: '15GB', calls: 'Unlimited', sms: 'Unlimited', description: 'Business class international roaming' },
      
      // Data Booster Plans
      { amount: 58, validity: '28 days', data: '3GB', calls: 'NA', sms: 'NA', description: 'Extra data top-up addon' },
      { amount: 98, validity: '28 days', data: '6GB', calls: 'NA', sms: 'NA', description: 'High-speed data booster' },
      { amount: 181, validity: '28 days', data: '15GB', calls: 'NA', sms: 'NA', description: 'Premium data addon for heavy users' },
    ],
  },
  {
    name: 'Jio',
    circle: 'All India',
    logo: 'jio.png',
    type: 'prepaid',
    plans: [
      // Recommended Plans
      { amount: 149, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value plan with JioApps included' },
      { amount: 239, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Truly unlimited with JioTV and JioCinema' },
      { amount: 399, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity plan with JioSaavn Pro' },
      { amount: 666, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Quarterly pack with all Jio apps premium' },
      
      // Unlimited Plans  
      { amount: 155, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'True unlimited 5G with no speed cap' },
      { amount: 209, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Unlimited 5G data for 28 days' },
      { amount: 479, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited plan with 5G' },
      { amount: 719, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Quarterly unlimited with premium benefits' },
      { amount: 999, validity: '84 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Max unlimited data and calls' },
      
      // Movie & Entertainment Plans
      { amount: 329, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'JioCinema Premium + Sony LIV included' },
      { amount: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar Mobile subscription' },
      { amount: 719, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'All streaming apps with JioSaavn Pro' },
      { amount: 899, validity: '90 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium OTT bundle with Netflix Mobile' },
      { amount: 1199, validity: '84 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate entertainment with all OTT platforms' },
      
      // Cricket Special Plans
      { amount: 279, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'JioCinema Premium for live cricket' },
      { amount: 419, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Watch IPL and international cricket' },
      { amount: 649, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Full cricket season streaming pack' },
      
      // Monthly Plans
      { amount: 199, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly pack' },
      { amount: 299, validity: '30 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Enhanced monthly plan' },
      { amount: 349, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with Netflix' },
      { amount: 549, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Two-month unlimited plan' },
      
      // Yearly Plans
      { amount: 1899, validity: '365 days', data: '24GB', calls: 'Unlimited', sms: '3600', description: 'Annual plan with JioSaavn Pro' },
      { amount: 2999, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Yearly unlimited with all Jio apps' },
      { amount: 3599, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly with OTT subscriptions' },
      { amount: 4199, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Ultimate yearly plan with priority support' },
      
      // International Roaming
      { amount: 2899, validity: '28 days', data: '6GB', calls: '1000 mins', sms: '100', description: 'International roaming for USA, UK, UAE' },
      { amount: 5751, validity: '30 days', data: '12GB', calls: 'Unlimited', sms: '100', description: 'Premium IR pack for Europe and Americas' },
      { amount: 7999, validity: '30 days', data: '20GB', calls: 'Unlimited', sms: 'Unlimited', description: 'Global roaming with priority network' },
      { amount: 8999, validity: '30 days', data: '25GB', calls: 'Unlimited', sms: 'Unlimited', description: 'Business international roaming pack' },
      
      // Data Addon Plans
      { amount: 61, validity: '28 days', data: '6GB', calls: 'NA', sms: 'NA', description: 'Quick data top-up' },
      { amount: 101, validity: '28 days', data: '12GB', calls: 'NA', sms: 'NA', description: 'High-speed data addon' },
      { amount: 222, validity: '30 days', data: '25GB', calls: 'NA', sms: 'NA', description: 'Premium data booster pack' },
    ],
  },
  {
    name: 'Vi',
    circle: 'All India',
    logo: 'vi.png',
    type: 'prepaid',
    plans: [
      // Recommended Plans
      { amount: 149, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Value for money prepaid plan' },
      { amount: 219, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most popular Vi plan with weekend data' },
      { amount: 329, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium plan with Vi Movies & TV' },
      { amount: 479, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity with Disney+ Hotstar Mobile' },
      
      // Unlimited Plans
      { amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Truly unlimited voice and data' },
      { amount: 269, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Unlimited with weekend data rollover' },
      { amount: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Unlimited plan for 2 months' },
      { amount: 699, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Quarterly unlimited pack' },
      { amount: 949, validity: '84 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Max unlimited with premium benefits' },
      
      // Movie & Entertainment Plans
      { amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Vi Movies & TV app included' },
      { amount: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Disney+ Hotstar Mobile for 2 months' },
      { amount: 699, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Amazon Prime Video Mobile included' },
      { amount: 899, validity: '84 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium entertainment bundle' },
      { amount: 1099, validity: '84 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'All OTT apps with Vi Premium' },
      
      // Cricket Plans
      { amount: 265, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Watch live cricket on Vi app' },
      { amount: 419, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'IPL special pack with streaming' },
      { amount: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Complete cricket season pack' },
      
      // Monthly Plans
      { amount: 189, validity: '30 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly recharge' },
      { amount: 249, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Enhanced monthly plan' },
      { amount: 359, validity: '30 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly with extras' },
      { amount: 539, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Two-month value plan' },
      
      // Yearly Plans
      { amount: 1799, validity: '365 days', data: '24GB', calls: 'Unlimited', sms: '3600', description: 'Annual plan with Vi benefits' },
      { amount: 2399, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Yearly unlimited with OTT' },
      { amount: 2999, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly with all benefits' },
      { amount: 3699, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'VIP yearly plan with priority service' },
      
      // International Roaming
      { amount: 2999, validity: '28 days', data: '5GB', calls: '500 mins', sms: '100', description: 'IR pack for USA, UAE, UK' },
      { amount: 4499, validity: '30 days', data: '10GB', calls: 'Unlimited', sms: '100', description: 'Premium roaming for Europe' },
      { amount: 6999, validity: '30 days', data: '15GB', calls: 'Unlimited', sms: 'Unlimited', description: 'Global roaming premium pack' },
      { amount: 8499, validity: '30 days', data: '20GB', calls: 'Unlimited', sms: 'Unlimited', description: 'Business class IR pack' },
      
      // Data Top-up
      { amount: 65, validity: '28 days', data: '4GB', calls: 'NA', sms: 'NA', description: 'Data top-up pack' },
      { amount: 118, validity: '28 days', data: '10GB', calls: 'NA', sms: 'NA', description: 'High-speed data booster' },
      { amount: 199, validity: '28 days', data: '20GB', calls: 'NA', sms: 'NA', description: 'Premium data addon' },
    ],
  },
  {
    name: 'BSNL',
    circle: 'All India',
    logo: 'bsnl.png',
    type: 'prepaid',
    plans: [
      // Recommended Plans
      { amount: 99, validity: '18 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Budget-friendly BSNL plan' },
      { amount: 147, validity: '30 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Monthly value pack' },
      { amount: 197, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Most popular monthly plan' },
      { amount: 397, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long validity budget plan' },
      
      // Unlimited Plans
      { amount: 107, validity: '25 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Unlimited calls and data' },
      { amount: 187, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'True unlimited with BSNL Tunes' },
      { amount: 319, validity: '45 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited plan' },
      { amount: 485, validity: '90 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Quarterly unlimited pack' },
      { amount: 797, validity: '160 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long-term unlimited plan' },
      
      // Entertainment Plans
      { amount: 229, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'With Eros Now subscription' },
      { amount: 349, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment pack with benefits' },
      { amount: 549, validity: '90 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium entertainment bundle' },
      { amount: 797, validity: '160 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Long-term with streaming apps' },
      
      // Cricket Plans  
      { amount: 199, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Watch cricket with data benefits' },
      { amount: 399, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Cricket season special pack' },
      
      // Monthly Plans
      { amount: 127, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly plan' },
      { amount: 167, validity: '30 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Enhanced monthly recharge' },
      { amount: 247, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium monthly plan' },
      { amount: 349, validity: '60 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Two-month value pack' },
      
      // Long Validity Plans
      { amount: 666, validity: '129 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '4+ months validity plan' },
      { amount: 997, validity: '180 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Half-yearly unlimited plan' },
      { amount: 1498, validity: '300 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: '10 months unlimited pack' },
      { amount: 1999, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual BSNL plan with benefits' },
      { amount: 2399, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly unlimited' },
      
      // International Roaming
      { amount: 2997, validity: '30 days', data: '5GB', calls: '300 mins', sms: '100', description: 'SAARC countries IR pack' },
      { amount: 4999, validity: '30 days', data: '8GB', calls: '500 mins', sms: '100', description: 'Global roaming basic pack' },
      { amount: 6999, validity: '30 days', data: '12GB', calls: '1000 mins', sms: '100', description: 'Premium IR with worldwide coverage' },
      { amount: 8999, validity: '30 days', data: '20GB', calls: 'Unlimited', sms: 'Unlimited', description: 'Business IR plan for all countries' },
      
      // Data Booster
      { amount: 56, validity: '28 days', data: '5GB', calls: 'NA', sms: 'NA', description: 'Extra data top-up' },
      { amount: 97, validity: '28 days', data: '10GB', calls: 'NA', sms: 'NA', description: 'High-speed data addon' },
      { amount: 177, validity: '28 days', data: '20GB', calls: 'NA', sms: 'NA', description: 'Premium data booster' },
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