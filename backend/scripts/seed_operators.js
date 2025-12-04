// backend/scripts/seed_operators.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobile_recharge_dev';
const dbName = 'mobile_recharge_dev';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db(dbName);
  const operators = db.collection("operators");

  const docs = [
    {
      name: "Airtel",
      code: "AIRTEL",
      circle: "TN",
      plans: [
        { planId: "airtel-100", amount: 100, description: "₹100 Test Recharge" },
        { planId: "airtel-199", amount: 199, description: "₹199 Test Recharge" }
      ],
      createdAt: new Date()
    },
    {
      name: "Jio",
      code: "JIO",
      circle: "TN",
      plans: [
        { planId: "jio-149", amount: 149, description: "₹149 Test Recharge" }
      ],
      createdAt: new Date()
    }
  ];

  const result = await operators.insertMany(docs);
  console.log("Inserted operators:", result.insertedCount);

  await client.close();
}

run().catch(err => {
  console.error("Seed error:", err);
});
