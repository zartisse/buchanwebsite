-- Allow Coming Soon property status
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('Available', 'Coming Soon', 'Sold', 'Draft'));
