const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = 'gpt-4o-mini';

export async function embedTexts(apiKey: string, texts: string[]): Promise<number[][]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI embeddings failed: ${err}`);
  }
  const data = await res.json();
  return data.data.map((row: { embedding: number[] }) => row.embedding);
}

export async function embedText(apiKey: string, text: string): Promise<number[]> {
  const [embedding] = await embedTexts(apiKey, [text]);
  return embedding;
}

export async function chatCompletion(
  apiKey: string,
  system: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      temperature: 0.45,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI chat failed: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
