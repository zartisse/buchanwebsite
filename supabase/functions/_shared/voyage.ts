const EMBEDDING_MODEL = Deno.env.get('VOYAGE_EMBEDDING_MODEL') ?? 'voyage-3';
/** voyage-3 default dimension (matches migration 010) */
export const EMBEDDING_DIMENSION = 1024;

export async function embedTexts(
  apiKey: string,
  texts: string[],
  inputType: 'document' | 'query' = 'document',
): Promise<number[][]> {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
      input_type: inputType,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage embeddings failed: ${err}`);
  }
  const data = await res.json();
  return data.data.map((row: { embedding: number[] }) => row.embedding);
}

export async function embedText(
  apiKey: string,
  text: string,
  inputType: 'document' | 'query' = 'query',
): Promise<number[]> {
  const [embedding] = await embedTexts(apiKey, [text], inputType);
  return embedding;
}
