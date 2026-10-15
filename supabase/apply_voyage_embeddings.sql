-- Paste into Supabase SQL Editor → Run (after apply_chatbot_migration.sql)
-- Same as migrations/010_voyage_embeddings.sql

DELETE FROM knowledge_chunks;

DROP INDEX IF EXISTS knowledge_chunks_embedding_idx;

ALTER TABLE knowledge_chunks
  ALTER COLUMN embedding TYPE vector(1024);

CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx ON knowledge_chunks
  USING hnsw (embedding vector_cosine_ops);

CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  source_id uuid,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kc.id,
    kc.source_id,
    kc.content,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE kc.embedding IS NOT NULL
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$;
