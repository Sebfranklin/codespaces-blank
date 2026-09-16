#!/usr/bin/env node
// Gospel waitlist — GitHub Action sender.
// Triggered by repository_dispatch (dashboard button) or workflow_dispatch (manual).
// Reads subject/body/recipients from env (DISPATCH_*), list from waitlist-signups.json,
// sends via Gmail SMTP using GMAIL_APP_PASSWORD repo secret. No OAuth, no extra auth.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SENDER_EMAIL = 'gospelnetapp@gmail.com';
const SENDER_NAME = 'Gospel Team';
const APP_URL = 'https://gospelapp.pages.dev';

function loadSubscribers() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'waitlist-signups.json'), 'utf8'));
  const seen = new Set();
  const unique = [];
  for (const item of raw) {
    const email = item.data?.email?.trim().toLowerCase();
    const name = item.data?.full_name?.trim() || 'Beloved';
    if (email && !seen.has(email)) {
      seen.add(email);
      unique.push({ name, email });
    }
  }
  return unique;
}

function renderTemplate(template, user) {
  const firstName = user.name.split(' ')[0] || user.name;
  return template
    .replace(/{{name}}/g, user.name)
    .replace(/{{first_name}}/g, firstName)
    .replace(/{{email}}/g, user.email)
    .replace(/{{app_url}}/g, APP_URL);
}

const subject = process.env.DISPATCH_SUBJECT || 'Welcome to Gospel, {{name}}! Early Fellowship Access';
const body = process.env.DISPATCH_BODY || 'Dear {{name}}, welcome to Gospel!';
const testTo = (process.env.DISPATCH_TEST_TO || '').trim();
const limit = Math.min(parseInt(process.env.DISPATCH_LIMIT || '40', 10) || 40, 200);
const password = (process.env.GMAIL_APP_PASSWORD || '').trim();
if (!password) {
  console.error('::error::GMAIL_APP_PASSWORD secret is missing. Add it under repo Settings → Secrets → Actions.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: SENDER_EMAIL, pass: password },
});

await transporter.verify();
console.log('SMTP verified as', SENDER_EMAIL);

if (testTo) {
  const user = { name: 'Test User', email: testTo };
  const info = await transporter.sendMail({
    from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    to: testTo,
    subject: renderTemplate(subject, user),
    text: renderTemplate(body, user),
  });
  console.log(`Test email sent to ${testTo}. Message ID: ${info.messageId}`);
  process.exit(0);
}

const list = loadSubscribers().slice(0, limit);
console.log(`Broadcasting to ${list.length} subscribers…`);
let sent = 0;
let failed = 0;
for (let i = 0; i < list.length; i++) {
  const user = list[i];
  try {
    process.stdout.write(`[${i + 1}/${list.length}] ${user.email}… `);
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: user.email,
      subject: renderTemplate(subject, user),
      text: renderTemplate(body, user),
    });
    console.log('sent');
    sent++;
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
    failed++;
  }
  if (i < list.length - 1) await new Promise((r) => setTimeout(r, 1200));
}
console.log(`Done: ${sent} sent, ${failed} failed.`);
if (failed > 0 && sent === 0) process.exit(1);
