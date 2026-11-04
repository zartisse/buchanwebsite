// notify-submission: emails each new website inquiry to the sales team and,
// optionally, copies it into HubSpot. Called by the site right after a form is
// saved to the `submissions` table.
//
// Secrets (Supabase -> Edge Functions -> Secrets):
//   RESEND_API_KEY      required for email (resend.com, free tier is enough)
//   NOTIFY_TO           optional, comma-separated. Default: mischellem@buchan.com
//   NOTIFY_FROM         optional. Default: "Buchan Website <onboarding@resend.dev>"
//                       (use an address on a domain verified in Resend, e.g. website@buchan.com)
//   HUBSPOT_PORTAL_ID   optional, with HUBSPOT_FORM_GUID: also submit the lead to a HubSpot form
//   HUBSPOT_FORM_GUID   optional
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// (self-contained copy of ../_shared helpers so it can be deployed from the Supabase dashboard editor)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
function createAdminClient() {
  return createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
    auth: { persistSession: false },
  });
}

const MAX_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000;

type Lead = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  source?: string;
  property_name?: string;
  page_url?: string;
};

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function allowed(supabase: ReturnType<typeof createAdminClient>, key: string): Promise<boolean> {
  const now = Date.now();
  const { data: row } = await supabase.from('chat_rate_limits').select('*').eq('bucket_key', key).maybeSingle();
  if (!row || now - new Date(row.window_start).getTime() > WINDOW_MS) {
    await supabase.from('chat_rate_limits').upsert({
      bucket_key: key,
      request_count: 1,
      window_start: new Date(now).toISOString(),
    });
    return true;
  }
  if (row.request_count >= MAX_PER_HOUR) return false;
  await supabase.from('chat_rate_limits').update({ request_count: row.request_count + 1 }).eq('bucket_key', key);
  return true;
}

async function sendEmail(lead: Required<Lead>): Promise<string | null> {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return 'RESEND_API_KEY not set';
  const to = (Deno.env.get('NOTIFY_TO') || 'mischellem@buchan.com').split(',').map((s) => s.trim()).filter(Boolean);
  const from = Deno.env.get('NOTIFY_FROM') || 'Buchan Website <onboarding@resend.dev>';

  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone || '—'],
    ['Topic', lead.subject || '—'],
    ['Property', lead.property_name || '—'],
    ['Form', lead.source || '—'],
    ['Page', lead.page_url || '—'],
  ];
  const html = `<div style="font-family:Montserrat,Arial,sans-serif;color:#2F3430;font-size:14px;line-height:1.5">
<p style="margin:0 0 12px"><strong style="color:#213B31">New website inquiry</strong></p>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#B88A4B;vertical-align:top">${k}</td><td>${esc(v)}</td></tr>`)
    .join('')}</table>
<p style="margin:16px 0 4px;color:#B88A4B">Message</p>
<p style="margin:0;white-space:pre-wrap">${esc(lead.message || '—')}</p>
<p style="margin:20px 0 0;font-size:12px;color:#857B66">Reply to this email to answer the client directly. All inquiries are also in the website admin under Submissions.</p>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email,
      subject: `New inquiry: ${lead.subject || 'Website'} — ${lead.name}`,
      html,
    }),
  });
  return res.ok ? null : `Resend ${res.status}: ${await res.text()}`;
}

async function sendToHubSpot(lead: Required<Lead>): Promise<string | null> {
  const portal = Deno.env.get('HUBSPOT_PORTAL_ID');
  const form = Deno.env.get('HUBSPOT_FORM_GUID');
  if (!portal || !form) return null;
  const [firstname, ...rest] = lead.name.split(/\s+/);
  const fields = [
    { name: 'email', value: lead.email },
    { name: 'firstname', value: firstname ?? '' },
    { name: 'lastname', value: rest.join(' ') },
    { name: 'phone', value: lead.phone },
    { name: 'message', value: [lead.subject, lead.property_name, lead.message].filter(Boolean).join(' | ') },
  ].filter((f) => f.value);
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${form}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, context: { pageUri: lead.page_url, pageName: lead.source } }),
  });
  return res.ok ? null : `HubSpot ${res.status}: ${await res.text()}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const body = (await req.json()) as Lead;
    const lead: Required<Lead> = {
      name: clip(body.name, 120),
      email: clip(body.email, 200),
      phone: clip(body.phone, 40),
      subject: clip(body.subject, 160),
      message: clip(body.message, 5000),
      source: clip(body.source, 80),
      property_name: clip(body.property_name, 160),
      page_url: clip(body.page_url, 300),
    };
    if (!lead.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
      return jsonResponse({ error: 'name and valid email required' }, 400);
    }

    const supabase = createAdminClient();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!(await allowed(supabase, `lead:${ip}`.slice(0, 120)))) {
      return jsonResponse({ error: 'Too many requests' }, 429);
    }

    const errors = (await Promise.all([sendEmail(lead), sendToHubSpot(lead)])).filter(Boolean);
    if (errors.length) console.error('notify-submission:', errors.join(' | '));
    return jsonResponse({ ok: errors.length === 0 });
  } catch (e) {
    console.error('notify-submission failed', e);
    return jsonResponse({ error: 'Notification failed' }, 500);
  }
});
