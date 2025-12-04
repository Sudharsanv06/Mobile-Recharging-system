#!/usr/bin/env node

/**
 * JWT Secret Generator for Production
 * Run: node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n=== JWT Secret Generator ===\n');

// Generate 32-byte (256-bit) secret
const secret = crypto.randomBytes(32).toString('hex');

console.log('Generated JWT Secret (copy this):');
console.log('─'.repeat(70));
console.log(secret);
console.log('─'.repeat(70));
console.log('\nLength:', secret.length, 'characters');
console.log('\n✅ Use this value for JWT_SECRET environment variable in Render\n');

// Also show base64 version as alternative
const base64Secret = crypto.randomBytes(32).toString('base64');
console.log('Alternative (Base64):');
console.log('─'.repeat(70));
console.log(base64Secret);
console.log('─'.repeat(70));
console.log('\nLength:', base64Secret.length, 'characters\n');
