-- Portfolio type for admin-managed filtering
ALTER TABLE properties ADD COLUMN IF NOT EXISTS portfolio_type TEXT NOT NULL DEFAULT 'custom-homes';
