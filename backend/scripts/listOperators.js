const connectDB = require('../config/db');
const Operator = require('../models/Operator');

async function list() {
  try {
    await connectDB();
    const ops = await Operator.find().lean();
    console.log(JSON.stringify(ops, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error listing operators:', err);
    process.exit(1);
  }
}

list();
