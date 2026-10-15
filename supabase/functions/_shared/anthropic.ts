const CHAT_MODEL = Deno.env.get('ANTHROPIC_CHAT_MODEL') ?? 'claude-sonnet-4-20250514';

export async function chatCompletion(
  apiKey: string,
  system: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      max_tokens: 1024,
      temperature: 0.3,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic chat failed: ${err}`);
  }
  const data = await res.json();
  const block = data.content?.find((b: { type: string }) => b.type === 'text');
  return block?.text?.trim() ?? '';
}
