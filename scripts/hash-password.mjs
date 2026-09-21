#!/usr/bin/env node
/**
 * Generates a scrypt hash for the admin password.
 *
 *   node scripts/hash-password.mjs "your-strong-password"
 *
 * Put the printed value in ADMIN_PASSWORD_HASH inside .env.local.
 */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-strong-password"');
  process.exit(1);
}

if (password.length < 10) {
  console.error("Please choose a password of at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = scryptSync(password, salt, 64).toString("hex");
console.log(`\nADMIN_PASSWORD_HASH=scrypt:${salt}:${derived}\n`);
