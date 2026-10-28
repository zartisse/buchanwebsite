-- Website crawl sources: a 'crawl' root owns one 'url' child per discovered page.
-- Also guarantees OpenAI text-embedding-3-small dimensions (1536) in case 010 (Voyage, 1024) was applied.

ALTER TABLE knowledge_sources DROP CONSTRAINT IF EXISTS knowledge_sources_type_check;
ALTER TABLE knowledge_sources ADD CONSTRAINT knowledge_sources_type_check
  CHECK (type IN ('pdf', 'url', 'text', 'image', 'cms_sync', 'crawl'));

ALTER TABLE knowledge_sources
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS knowledge_sources_parent_id_idx ON knowledge_sources(parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS knowledge_sources_parent_url_idx ON knowledge_sources(parent_id, source_url);

DO $$
DECLARE
  dims int;
BEGIN
  SELECT a.atttypmod INTO dims
  FROM pg_attribute a
  WHERE a.attrelid = 'knowledge_chunks'::regclass AND a.attname = 'embedding';

  IF dims IS DISTINCT FROM 1536 THEN
    DELETE FROM knowledge_chunks;
    DROP INDEX IF EXISTS knowledge_chunks_embedding_idx;
    ALTER TABLE knowledge_chunks ALTER COLUMN embedding TYPE vector(1536);
    CREATE INDEX knowledge_chunks_embedding_idx ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);
    UPDATE knowledge_sources SET status = 'pending' WHERE status = 'indexed';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(1536),
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
