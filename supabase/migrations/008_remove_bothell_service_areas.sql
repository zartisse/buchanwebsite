-- Remove Bothell from seeded areas-we-serve hub content (service_areas chips + prose).
UPDATE site_pages
SET content = jsonb_set(
  jsonb_set(
    content,
    '{service_areas}',
    (
      SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
      FROM jsonb_array_elements_text(content->'service_areas') AS elem
      WHERE elem <> 'Bothell'
    )
  ),
  '{sections}',
  (
    SELECT COALESCE(jsonb_agg(
      CASE
        WHEN section->>'title' = 'Primary Markets' THEN
          jsonb_set(
            section,
            '{body}',
            to_jsonb(replace(section->>'body', ', and Bothell.', '.'))
          )
        ELSE section
      END
    ), '[]'::jsonb)
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE slug = 'areas-we-serve';
