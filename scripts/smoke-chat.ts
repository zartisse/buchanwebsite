/**
 * Smoke-test the chat Edge Function (requires .env.local with Supabase + deployed `chat` function).
 *
 * Run: npx tsx scripts/smoke-chat.ts
 *
 * Prerequisites:
 * - OPENAI_API_KEY set in Supabase Edge Function secrets
 * - chatbot_settings.enabled = true
 * - Migration 009 applied; knowledge indexed (optional but recommended)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env.local');

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnv();

/** Pass a question to test crawled knowledge: npm run cms:smoke-chat -- "What is aging in place?" */
const question = process.argv.slice(2).join(' ').trim() || 'Do you build custom homes in Bellevue?';
const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

async function main() {
  if (!url || !anonKey || url.includes('your-project')) {
    console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }

  const fnUrl = `${url.replace(/\/$/, '')}/functions/v1/chat`;
  const res = await fetch(fnUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
    body: JSON.stringify({
      message: question,
      sessionId: crypto.randomUUID(),
      history: [],
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`✗ chat HTTP ${res.status}:`, body.error ?? body);
    process.exit(1);
  }

  if (!body.reply || typeof body.reply !== 'string') {
    console.error('✗ Unexpected response:', body);
    process.exit(1);
  }

  console.log('✓ chat responded');
  console.log('  Question:', question);
  console.log('  Reply preview:', body.reply.slice(0, 400) + (body.reply.length > 400 ? '…' : ''));
  if (body.citations?.length) {
    console.log('  Citations:', body.citations.map((c: { title: string }) => c.title).join(', '));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
