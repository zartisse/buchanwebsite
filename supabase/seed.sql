-- Seed data from Admin.dc.html prototype
-- Run after 001_schema.sql in Supabase SQL editor

INSERT INTO posts (title, slug, category, status, date, excerpt, body, image_url) VALUES
  ('What "built for the rain" really means in the Pacific Northwest.', 'built-for-the-rain', 'Industry News', 'Published', '2026-05-18', 'In a climate that sees rain two hundred days a year, the difference is in the details you never see.', 'Most new construction is built to a code minimum. We build beyond it — with rain screens, proper flashing, and materials chosen for a climate that tests every joint. The result is a home that stays quiet and dry through decades of Pacific Northwest weather.', '/assets/ph-arch-2.png'),
  ('Inside our Clyde Hill estate, from framing to finish.', 'clyde-hill-framing-to-finish', 'Company Updates', 'Published', '2026-05-04', 'A look at every stage of one of our most considered builds to date.', 'From the first stake in the ground to the final walkthrough, this Clyde Hill estate represents everything we believe about custom building on the Eastside.', '/assets/ph-arch-3.png'),
  ('Why hand-chosen lumber makes a quieter home.', 'hand-chosen-lumber', 'Industry News', 'Published', '2026-04-21', 'Straight, dry, and true — selected by hand before it ever meets the wall.', 'Every board is inspected before it goes in. That attention to grain, moisture content, and straightness is what makes the difference between a house that settles and one that feels solid from day one.', '/assets/ph-arch-4.png'),
  ('Welcoming the next generation of Buchan craftspeople.', 'next-generation', 'Company Updates', 'Draft', '2026-04-09', 'New hands, same standard.', '', '/assets/ph-arch-1.png'),
  ('The case for building on your own lot.', 'building-on-your-lot', 'Industry News', 'Published', '2026-03-27', 'Why the land you love is the best place to build the home you want.', 'Your lot is more than an address — it is the context for everything that follows. We build on your land, designed for your life.', '/assets/ph-arch-2.png'),
  ('Six Best of Houzz awards, and what they mean to us.', 'best-of-houzz', 'Company Updates', 'Draft', '2026-03-12', 'Recognition is nice. The standard behind it is the point.', '', '/assets/ph-arch-3.png')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO properties (name, slug, status, address, city, beds, baths, sqft, lot, year, description, image_url) VALUES
  ('Laurelwood Estate', 'laurelwood-estate', 'Available', '1024 92nd Ave NE', 'Bellevue', '5', '6', '6,800', '0.9', '2025', 'A custom residence in Bellevue, built from the ground up on the owner''s lot.', '/assets/ph-arch-1.png'),
  ('Creekside Retreat', 'creekside-retreat', 'Sold', '7820 Overlake Dr W', 'Kirkland', '4', '5', '5,200', '0.7', '2024', 'A refined home set along Kirkland''s creekside neighborhoods.', '/assets/ph-arch-2.png'),
  ('Yarrow Point Residence', 'yarrow-point-residence', 'Available', '4208 95th Ave NE', 'Yarrow Point', '5', '5.5', '5,900', '1.1', '2025', 'Water views and refined craftsmanship on Yarrow Point.', '/assets/ph-arch-3.png'),
  ('Hunts Point Manor', 'hunts-point-manor', 'Sold', '3110 Hunts Point Rd', 'Hunts Point', '6', '7', '8,200', '1.4', '2023', 'An estate-scale home on one of the Eastside''s most coveted peninsulas.', '/assets/ph-arch-4.png'),
  ('Clyde Hill Estate', 'clyde-hill-estate', 'Available', '6512 132nd Pl NE', 'Clyde Hill', '4', '4.5', '4,800', '0.6', '2025', 'Set on nearly an acre in Clyde Hill.', '/assets/ph-arch-2.png'),
  ('West Bellevue Contemporary', 'west-bellevue-contemporary', 'Sold', '1640 98th Ave NE', 'Bellevue', '5', '6', '6,100', '0.8', '2024', 'Clean lines and warm materials in the heart of West Bellevue.', '/assets/ph-arch-3.png')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO submissions (name, email, phone, subject, message, source, status, created_at) VALUES
  ('Andrew Coletti', 'a.coletti@gmail.com', '206-555-0142', 'I want to build a custom home', 'We just closed on a lot in Clyde Hill and would love to talk about a ground-up build. Targeting roughly 6,000 sqft, five bedrooms. When could we meet?', 'Contact page', 'New', '2026-06-16T09:24:00Z'),
  ('Priya Anand', 'priya.anand@outlook.com', '', 'I am looking for a new home', 'Is the Bridle Trails Retreat still available? We would like to arrange a private viewing this week if possible.', 'Contact page', 'New', '2026-06-15T17:48:00Z'),
  ('Mark Whitfield', 'mwhitfield@whitfieldcap.com', '425-555-0199', 'I have land to sell', 'I own a tear-down property in Medina, about 0.8 acre. Interested in discussing a sale to Buchan.', 'Home page', 'Read', '2026-06-13T11:02:00Z'),
  ('The Levy Family', 'levyhome@icloud.com', '206-555-0177', 'I''m planning a remodel', 'Looking to remodel the main floor and primary suite of our Yarrow Point home. Would value your perspective.', 'Contact page', 'Archived', '2026-06-10T08:15:00Z');
