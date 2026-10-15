-- Chatbot knowledge base (RAG) + settings

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chatbot_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN NOT NULL DEFAULT true,
  phone TEXT NOT NULL DEFAULT '425.827.2266',
  phone_href TEXT NOT NULL DEFAULT 'tel:4258272266',
  hubspot_meeting_url TEXT NOT NULL DEFAULT 'https://meetings-na2.hubspot.com/mischelle-mccall',
  welcome_message TEXT NOT NULL DEFAULT 'Hi! I can answer questions about John Buchan Homes, custom builds, and renovations. How can I help?',
  system_prompt_append TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO chatbot_settings (enabled, phone, phone_href, hubspot_meeting_url, welcome_message)
SELECT true, '425.827.2266', 'tel:4258272266', 'https://meetings-na2.hubspot.com/mischelle-mccall',
  'Hi! I can answer questions about John Buchan Homes, custom builds, and renovations. How can I help?'
WHERE NOT EXISTS (SELECT 1 FROM chatbot_settings LIMIT 1);

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('pdf', 'url', 'text', 'image', 'cms_sync')),
  title TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL DEFAULT '',
  body_text TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'indexing', 'indexed', 'error')),
  error_message TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS knowledge_sources_updated_at ON knowledge_sources;
CREATE TRIGGER knowledge_sources_updated_at BEFORE UPDATE ON knowledge_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  token_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS knowledge_chunks_source_id_idx ON knowledge_chunks(source_id);
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx ON knowledge_chunks
  USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_logs_session_id_idx ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS chat_logs_created_at_idx ON chat_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS chat_rate_limits (
  bucket_key TEXT PRIMARY KEY,
  request_count INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read chatbot settings" ON chatbot_settings;
CREATE POLICY "Public read chatbot settings" ON chatbot_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage chatbot settings" ON chatbot_settings;
CREATE POLICY "Authenticated manage chatbot settings" ON chatbot_settings
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated manage knowledge sources" ON knowledge_sources;
CREATE POLICY "Authenticated manage knowledge sources" ON knowledge_sources
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated read knowledge chunks" ON knowledge_sources;
-- Chunks: no direct client access (Edge Functions use service role)
DROP POLICY IF EXISTS "No direct chunk access" ON knowledge_chunks;
CREATE POLICY "No direct chunk access" ON knowledge_chunks
  FOR ALL USING (false);

DROP POLICY IF EXISTS "Authenticated read chat logs" ON chat_logs;
CREATE POLICY "Authenticated read chat logs" ON chat_logs
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "No direct chat rate access" ON chat_rate_limits;
CREATE POLICY "No direct chat rate access" ON chat_rate_limits
  FOR ALL USING (false);
