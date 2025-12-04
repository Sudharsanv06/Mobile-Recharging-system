#!/usr/bin/env node

/**
 * Environment Variables Validator for Production Deployment
 * Run before deploying to catch missing or invalid values
 */

const requiredVars = {
  // Server
  NODE_ENV: { 
    required: true, 
    validate: (v) => ['production', 'development'].includes(v),
    message: 'Must be "production" or "development"'
  },
  
  // Database
  MONGODB_URI: { 
    required: true,
    validate: (v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'),
    message: 'Must start with mongodb:// or mongodb+srv://'
  },
  
  // Auth
  JWT_SECRET: { 
    required: true,
    validate: (v) => v.length >= 32,
    message: 'Must be at least 32 characters long'
  },
  
  // Razorpay
  RAZORPAY_KEY_ID: { 
    required: true,
    validate: (v) => v.startsWith('rzp_'),
    message: 'Must start with rzp_'
  },
  RAZORPAY_KEY_SECRET: { required: true },
  RAZORPAY_WEBHOOK_SECRET: { 
    required: false,
    message: 'Can be added after webhook creation'
  },
  
  // Twilio (Optional but recommended)
  TWILIO_ACCOUNT_SID: { 
    required: false,
    validate: (v) => !v || v.startsWith('AC'),
    message: 'Should start with AC if provided'
  },
  TWILIO_AUTH_TOKEN: { required: false },
  TWILIO_PHONE_NUMBER: { 
    required: false,
    validate: (v) => !v || v.startsWith('+'),
    message: 'Should start with + if provided'
  },
  
  // Email
  SMTP_HOST: { required: true },
  SMTP_PORT: { 
    required: true,
    validate: (v) => !isNaN(v) && parseInt(v) > 0,
    message: 'Must be a valid port number'
  },
  SMTP_USER: { 
    required: true,
    validate: (v) => v.includes('@'),
    message: 'Must be a valid email address'
  },
  SMTP_PASS: { 
    required: true,
    validate: (v) => v.length >= 8,
    message: 'Should be at least 8 characters (app password)'
  },
  EMAIL_FROM: { 
    required: true,
    validate: (v) => v.includes('@'),
    message: 'Must be a valid email address'
  },
  
  // CORS
  ALLOWED_ORIGINS: { 
    required: true,
    validate: (v) => v.includes('http'),
    message: 'Must contain at least one URL with http/https'
  },
};

console.log('\n🔍 Validating Environment Variables for Production\n');
console.log('=' .repeat(70));

let hasErrors = false;
let warnings = [];
const results = [];

// Check each required variable
Object.entries(requiredVars).forEach(([key, config]) => {
  const value = process.env[key];
  const status = {
    key,
    present: !!value,
    valid: true,
    message: '',
    level: 'info'
  };
  
  if (!value) {
    if (config.required) {
      status.valid = false;
      status.level = 'error';
      status.message = '❌ MISSING - Required for deployment';
      hasErrors = true;
    } else {
      status.level = 'warning';
      status.message = `⚠️  Optional - ${config.message || 'Not set'}`;
      warnings.push(key);
    }
  } else {
    // Validate value if validator exists
    if (config.validate && !config.validate(value)) {
      status.valid = false;
      status.level = 'error';
      status.message = `❌ INVALID - ${config.message || 'Invalid format'}`;
      hasErrors = true;
    } else {
      status.message = '✅ OK';
      
      // Additional checks
      if (key === 'JWT_SECRET' && value === 'your_jwt_secret_key_here_minimum_32_characters') {
        status.valid = false;
        status.level = 'error';
        status.message = '❌ Using example value - Generate a real secret!';
        hasErrors = true;
      }
      
      if (key === 'MONGODB_URI' && value.includes('username:password')) {
        status.valid = false;
        status.level = 'error';
        status.message = '❌ Using template - Replace with real credentials!';
        hasErrors = true;
      }
    }
  }
  
  results.push(status);
});

// Display results
results.forEach(({ key, message, level }) => {
  const symbol = level === 'error' ? '❌' : level === 'warning' ? '⚠️ ' : '✅';
  const color = level === 'error' ? '\x1b[31m' : level === 'warning' ? '\x1b[33m' : '\x1b[32m';
  const reset = '\x1b[0m';
  
  console.log(`${color}${symbol} ${key.padEnd(30)}${message}${reset}`);
});

console.log('=' .repeat(70));

// Summary
console.log('\n📊 Summary:\n');
console.log(`✅ Valid:    ${results.filter(r => r.valid && r.present).length}`);
console.log(`⚠️  Warnings: ${warnings.length} ${warnings.length > 0 ? `(${warnings.join(', ')})` : ''}`);
console.log(`❌ Errors:   ${results.filter(r => !r.valid).length}`);

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED\n');
  console.log('Fix the errors above before deploying to production.');
  console.log('\nQuick fixes:');
  console.log('- Generate JWT secret: node scripts/generate-jwt-secret.js');
  console.log('- Get MongoDB URI from Atlas dashboard');
  console.log('- Get Razorpay keys from dashboard.razorpay.com');
  console.log('- Generate Gmail app password at myaccount.google.com/apppasswords');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS\n');
  console.log('Optional services not configured. App will work but some features may be disabled:');
  warnings.forEach(w => {
    console.log(`- ${w}`);
  });
  console.log('\nYou can deploy now and add these later if needed.');
  process.exit(0);
} else {
  console.log('\n✅ ALL CHECKS PASSED!\n');
  console.log('Environment variables are ready for production deployment.');
  console.log('\n🚀 You can proceed with deployment to Render.\n');
  process.exit(0);
}
