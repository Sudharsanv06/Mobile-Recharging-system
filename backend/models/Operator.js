const mongoose = require('mongoose');

const OperatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
    required: true,
  },
  plans: [
    {
      amount: {
        type: Number,
        required: true,
      },
      validity: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      data: {
        type: String,
      },
      sms: {
        type: String,
      },
      voice: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Operator', OperatorSchema);