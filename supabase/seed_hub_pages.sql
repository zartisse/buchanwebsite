-- Seed all hub pages from default IA content
-- Run after 004_hub_pages.sql
-- Regenerate: npx tsx scripts/generate-hub-seed.ts

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'custom-homes',
  'Custom Homes',
  'Ground-up custom homes on your lot across the Seattle Eastside.',
  '{"hero":{"eyebrow":"Custom Homes","title":"Built on your lot.","titleEmphasis":"Designed for your life.","image_url":"/assets/ph-arch-1.png"},"intro":"We specialize in ground-up custom homes, not spec inventory on our land. From feasibility through completion, one team carries your project forward with progressive estimates and the craftsmanship standards Buchan has protected for 65 years.","sections":[{"title":"Our Process","body":"Discovery through continuing care, four stages designed to reduce uncertainty at every decision point. You work with the same leadership team from first conversation through warranty.","bullets":["Discover & evaluate","Plan & align","Build with discipline","Care beyond completion"],"image_url":"/assets/ph-arch-2.png"},{"title":"Service Areas","body":"Bellevue, Clyde Hill, Medina, Hunts Point, Kirkland, Redmond, and surrounding Eastside communities. We know the jurisdictions, slopes, and neighborhood character, because we have built here since 1961.","image_url":"/assets/ph-arch-3.png"},{"title":"Cost & Planning","body":"Transparent progressive estimates before construction begins. Use our cost estimator for a preliminary range, then meet with our preconstruction team for a project-specific conversation.","bullets":["Online cost estimator","Preconstruction planning","Progressive budget ranges"]},{"title":"What Makes a Buchan Custom Home","body":"Hand-chosen materials, rain-screen detailing built for Pacific Northwest weather, and interior volumes resolved before finish work begins. The details you never see are the ones we lose sleep over."}],"ctaTitle":"Ready to plan your custom home?","ctaLink":"/contact?service=I want to build a custom home#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'land-and-site',
  'Land & Site Considerations',
  'Evaluate your lot, zoning, and site conditions before building on the Seattle Eastside.',
  '{"hero":{"eyebrow":"Custom Homes","title":"Land & site","titleEmphasis":"considerations.","image_url":"/assets/ph-arch-3.png"},"intro":"Before design begins, we evaluate what your property can support, zoning, setbacks, slope, utilities, and buildability, so your investment aligns with what is actually possible on your lot.","sections":[{"title":"Site Evaluation","body":"Topography, soil, drainage, and access are reviewed alongside jurisdictional requirements. We flag constraints early so they inform design, not surprise you mid-build.","bullets":["Zoning & setback review","Utility & easement mapping","Slope & drainage assessment"],"image_url":"/assets/ph-arch-2.png"},{"title":"Feasibility & Budget Alignment","body":"Progressive estimates tied to real site conditions, not generic per-square-foot guesses. You know what your lot supports before committing to full design."},{"title":"Working With Your Team","body":"We collaborate with your architect or recommend trusted independent professionals. Buchan leads constructability review, estimating, and schedule planning from the early stages.","image_url":"/assets/ph-arch-4.png"}],"ctaTitle":"Evaluate your property","ctaLink":"/property-feasibility"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'renovations',
  'Renovations',
  'Major home renovations on the Seattle Eastside with the same Buchan standard.',
  '{"hero":{"eyebrow":"Renovations","title":"Transform the home","titleEmphasis":"you already love.","image_url":"/assets/ph-arch-2.png"},"intro":"Whole-home and major renovation projects, kitchen and bath, structural additions, and full interior transformations. We apply the same preconstruction discipline and craftsmanship standards as our custom builds.","sections":[{"title":"Major Remodels","body":"Scope from cosmetic refreshes through whole-house renovations and structural additions. We evaluate existing conditions honestly, structure, envelope, mechanical, before committing to a schedule.","bullets":["Whole-home renovations","Kitchen & bath transformations","Additions & structural work"],"image_url":"/assets/ph-arch-4.png"},{"title":"Preconstruction First","body":"Renovations benefit from the same progressive estimating and planning discipline as custom builds. Living-in-place, phasing, and permit timelines are mapped before demolition begins."},{"title":"Living Through the Work","body":"For occupied renovations, we establish dust control, access paths, and weekly owner walkthroughs so you always know what is happening next, and when your kitchen will be back.","image_url":"/assets/ph-arch-1.png"},{"title":"Renovation FAQ","body":"Timeline, living-in-place, permits, and budget, answered in our FAQ section. Common Eastside renovation questions are covered there; your project gets a personal review."}],"ctaTitle":"Discuss your renovation project","ctaLink":"/contact?service=I''m planning a major renovation#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'preconstruction',
  'Preconstruction',
  'Feasibility, design coordination, progressive estimates, and construction readiness for custom homes and renovations.',
  '{"hero":{"eyebrow":"Preconstruction","title":"Know before","titleEmphasis":"you build.","image_url":"/assets/ph-arch-3.png"},"intro":"Our flagship planning phase feeds both custom homes and renovations, progressive estimates, constructability review, and design alignment before breaking ground.","sections":[{"title":"What''s Included","body":"Site evaluation, scope definition, budget ranges, schedule framework, and selection planning, documented so every stakeholder shares the same picture.","bullets":["Feasibility studies","Design coordination","Constructability review","Value engineering","Selection planning"],"image_url":"/assets/ph-arch-2.png"},{"title":"Why It Matters","body":"Preconstruction reduces surprises during construction, the phase where most custom projects succeed or struggle. A clear agreement here protects your budget and your timeline."},{"title":"Into Construction","body":"A clear preconstruction agreement transitions your project into build with aligned expectations on cost, schedule, and quality. No handoffs to a different team.","image_url":"/assets/ph-arch-4.png"}],"ctaTitle":"Start with preconstruction","ctaLink":"/contact?service=Preconstruction / planning#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'why-choose-buchan',
  'Why Choose Buchan',
  'Family-owned since 1961. 65 years of custom home building on the Seattle Eastside.',
  '{"hero":{"eyebrow":"Why Choose Buchan","title":"Build with","titleEmphasis":"certainty.","image_url":"/assets/ph-arch-4.png"},"intro":"Three generations, one standard, yours. We combine Eastside expertise with white-glove client care from first conversation through long-term warranty support.","sections":[{"title":"Family-Owned Since 1961","body":"65 years on the Eastside. Decisions made by people who know your project, not a ticket queue.","image_url":"/assets/ph-arch-1.png"},{"title":"Progressive Estimating","body":"Transparent pricing developed through preconstruction, not a single guess before design is resolved."},{"title":"Continuing Care","body":"Warranty, homeowner education, and Buchan Home Care, support that outlasts the keys."}],"ctaTitle":"See our work","ctaLink":"/portfolio"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'areas-we-serve',
  'Areas We Serve',
  'Custom homes and renovations across the Seattle Eastside.',
  '{"hero":{"eyebrow":"Local Expertise","title":"Areas we","titleEmphasis":"serve.","image_url":"/assets/ph-arch-1.png"},"intro":"Deep knowledge of Eastside jurisdictions, setbacks, slopes, and neighborhood character, built over 65 years in these communities.","sections":[{"title":"Primary Markets","body":"Bellevue, Medina, Clyde Hill, Yarrow Point, Hunts Point, Kirkland, Redmond, Newcastle, Mercer Island, Sammamish, Issaquah, Woodinville, and Bothell.","bullets":["Bellevue & Bridle Trails","Clyde Hill & Medina","Kirkland & Juanita","Redmond & Sammamish"],"image_url":"/assets/ph-arch-2.png"},{"title":"Jurisdiction Knowledge","body":"Setback rules, tree retention, slope stability, and design review processes vary block by block on the Eastside. We have navigated these jurisdictions for decades, relationships and reputation matter when permits are on the line."},{"title":"Jurisdiction Guides","body":"City-specific planning guides will be added over time, linking from each service area below. In the meantime, start with a property feasibility conversation."}],"ctaTitle":"Evaluate your property","ctaLink":"/property-feasibility","service_areas":["Bellevue","Medina","Clyde Hill","Yarrow Point","Hunts Point","Kirkland","Redmond","Newcastle","Mercer Island","Sammamish","Issaquah","Woodinville","Bothell"]}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'adus',
  'ADUs & DADUs',
  'Accessory dwelling units for family housing and rental income on the Seattle Eastside.',
  '{"hero":{"eyebrow":"ADUs & DADUs","title":"More living.","titleEmphasis":"Same lot.","image_url":"/assets/ph-arch-3.png"},"intro":"Detached and attached accessory dwelling units for aging-parent housing, guest space, or rental income, evaluated and built with the same Buchan team that handles custom homes.","sections":[{"title":"Feasibility","body":"We evaluate zoning, setbacks, utilities, and access before design begins. Washington ADU legislation has expanded options in many Eastside cities, but every lot is different.","bullets":["Zoning & setback review","Utility & sewer capacity","Access & parking requirements"],"image_url":"/assets/ph-arch-1.png"},{"title":"Design & Build","body":"Integrated with our custom home process, one team from concept through certificate of occupancy. No separate architect-builder handoffs."},{"title":"Zoning & Legislation","body":"Recent state and local ADU reforms may affect your property. We track Bellevue, Kirkland, Seattle-adjacent, and unincorporated King County rules so you understand what is possible before investing in design."},{"title":"Timelines & Budget","body":"Most ADU projects run 10–14 months from feasibility to completion, depending on jurisdiction and utility work. Preliminary ranges are available through our cost estimator; detailed budgets follow preconstruction."}],"ctaTitle":"Explore an ADU on your property","ctaLink":"/contact?service=ADU / DADU#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'fire-restoration',
  'Fire Restoration',
  'Fire and smoke damage restoration for Eastside homeowners.',
  '{"hero":{"eyebrow":"Fire Restoration","title":"Restore with","titleEmphasis":"care.","image_url":"/assets/ph-arch-4.png"},"intro":"Emergency response coordination and rebuild services for fire-damaged homes. Available through Services and Contact when you need a builder who understands insurance, structure, and finish quality together.","sections":[{"title":"Immediate Response","body":"Secure the site, assess structural integrity, and develop a recovery plan with your insurance partners. We document conditions thoroughly before any demolition.","image_url":"/assets/ph-arch-2.png"},{"title":"Insurance Coordination","body":"We work alongside adjusters and engineers with clear scope documentation, photo logs, and milestone-based billing so your claim stays on track.","bullets":["Structural assessment","Scope documentation","Phased recovery plan"]},{"title":"Phased Rebuild","body":"Envelope and structure first, then mechanical, then interior finish, sequenced to match insurance releases and your family''s housing plan."},{"title":"Rebuild to Buchan Standard","body":"Full restoration to Buchan quality standards, matching existing architecture where possible, improving envelope performance where the loss allows."}],"ctaTitle":"Contact us about fire restoration","ctaLink":"/contact?service=Fire restoration#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'planning-budgeting',
  'Planning & Budgeting',
  'Feasibility, design coordination, constructability, estimates, and compliance.',
  '{"hero":{"eyebrow":"Planning & Budgeting","title":"Clarity before","titleEmphasis":"commitment.","image_url":"/assets/ph-arch-2.png"},"intro":"Feasibility studies, design coordination, constructability review, progressive estimates, value engineering, and code compliance, the planning layer behind every Buchan project.","sections":[{"title":"Progressive Estimates","body":"Budget ranges refined as design resolves, tied to our Preconstruction flagship page. You see numbers update as decisions get made, not after.","image_url":"/assets/ph-arch-3.png"},{"title":"Constructability Review","body":"We review plans for buildability before you commit to expensive design iterations, catching conflicts between structure, envelope, and mechanical early."},{"title":"Code & Compliance","body":"Energy code, fire separation, stormwater, and accessibility requirements are mapped into the budget from the start, not discovered at permit submittal."},{"title":"Cost Tool & Next Steps","body":"Get a preliminary range with our online estimator, then follow up for a project-specific conversation. Planning services can stand alone or lead into a full preconstruction agreement.","bullets":["Online cost estimator","Preconstruction agreement","Design coordination"]}],"ctaTitle":"How much will my project cost?","ctaLink":"https://estimator.buchan.com/"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'real-estate',
  'Real Estate Services',
  'Find your lot, sell your current home, or explore selling directly to Buchan.',
  '{"hero":{"eyebrow":"Real Estate Services","title":"Three paths.","titleEmphasis":"One team.","image_url":"/assets/ph-arch-1.png"},"intro":"Three distinct relationships, not one blended service. Each path has its own process, timeline, and client relationship.","sections":[{"title":"Find Your Lot","body":"Buy-side sourcing for clients ready to build custom who do not yet have land.","image_url":"/assets/ph-arch-2.png"},{"title":"Sell Your Current Home","body":"Traditional listing and brokerage support while you plan or build your next home."},{"title":"Sell Directly to Buchan","body":"JBH may purchase your property as a principal buyer, not as your listing agent. Written disclosures explain the difference before any agreement."}],"ctaTitle":"Talk to our real estate team","ctaLink":"/contact?service=Real estate services#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'find-your-lot',
  'Find Your Lot',
  'Buy-side lot sourcing for custom home clients on the Seattle Eastside.',
  '{"hero":{"eyebrow":"Real Estate","title":"Find your","titleEmphasis":"lot.","image_url":"/assets/ph-arch-2.png"},"intro":"For clients who know they want to build custom but have not yet secured land, we help evaluate and source buildable lots aligned with your vision and budget.","sections":[{"title":"Search Criteria","body":"We start with how you want to live, schools, commute, views, privacy, then filter for lots that can support the home you have in mind, not just what is listed today.","bullets":["Location & lifestyle priorities","Budget range for land + build","Timeline flexibility"],"image_url":"/assets/ph-arch-3.png"},{"title":"Lot Evaluation Checklist","body":"Zoning, setbacks, slope, utilities, and access, understood before you commit. We flag deal-breakers early so you do not fall in love with land that cannot support your plan.","bullets":["Zoning & buildable area","Slope & geotechnical flags","Utility & sewer availability","Tree retention & critical areas"]},{"title":"Typical Timeline","body":"Lot search timelines vary, some clients find land in weeks, others over a year. We stay engaged through feasibility on shortlisted parcels so you know build cost before you write an offer."},{"title":"Next Steps","body":"Share your criteria through our contact form or call 425.827.2266. We will outline active opportunities and off-market relationships where appropriate."}],"ctaTitle":"Start lot search","ctaLink":"/contact?service=Find your lot#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'sell-your-home',
  'Sell Your Current Home',
  'Listing support for homeowners building or renovating with Buchan.',
  '{"hero":{"eyebrow":"Real Estate","title":"Sell your","titleEmphasis":"current home.","image_url":"/assets/ph-arch-3.png"},"intro":"Traditional brokerage support coordinated with your custom build or renovation timeline, so selling and building are one plan, not two competing urgencies.","sections":[{"title":"Staging & Presentation","body":"We advise on preparation that matters on the Eastside, curb presence, decluttering, and timing photography around your construction milestones.","image_url":"/assets/ph-arch-4.png"},{"title":"Timing With Your Build","body":"Align your sale with construction milestones so you are never between homes without a plan. Bridge scenarios, rent-backs, and phased move-outs are mapped early."},{"title":"Pricing Strategy","body":"Market analysis grounded in your neighborhood, not generic county averages. We coordinate listing strategy with your builder so showings do not conflict with active construction on your next home."},{"title":"Coordination With Buchan","body":"One team knows both sides of your transition. Your builder and brokerage share a timeline so decisions on one property support the other."}],"ctaTitle":"Discuss selling your home","ctaLink":"/contact?service=Sell my current home#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'sell-to-buchan',
  'Sell Directly to Buchan',
  'Explore a direct purchase of your home by John Buchan Homes.',
  '{"hero":{"eyebrow":"Real Estate","title":"Sell directly","titleEmphasis":"to Buchan.","image_url":"/assets/ph-arch-4.png"},"intro":"In select situations, John Buchan Homes may purchase your property directly as a principal buyer, for our own development or inventory purposes. This is not listing or brokerage service on your behalf.","sections":[{"title":"How this differs from listing your home","body":"When you list with a broker, you engage an agent to market your property to third-party buyers. When you sell directly to Buchan, we are the buyer. We do not represent you as a seller in a fiduciary brokerage relationship, we negotiate with you as a counterparty. You should consult your own legal and tax advisors before proceeding."},{"title":"When a direct sale may make sense","body":"Clients often explore this path when speed, certainty, or discretion matters more than maximizing every dollar through a public listing, for example, when coordinating a custom build timeline or avoiding showings while living in the home."},{"title":"Compliance & licensing notice","body":"John Buchan Homes holds Washington real estate and contractor licenses where required for its activities. Any direct purchase is documented with clear purchase-and-sale terms, earnest money handling consistent with state law, and written disclosure that JBH is acting as a principal buyer, not as your listing agent. Separate brokerage services, such as listing your home on the open market, are available through our real estate team and involve different representation."},{"title":"Fair, discreet process","body":"We evaluate each property individually, location, condition, zoning, and timing. Conversations are confidential. If a direct purchase is not the right fit, we will say so and outline alternatives, including traditional listing support.","image_url":"/assets/ph-arch-1.png"}],"ctaTitle":"Explore a direct sale","ctaLink":"/contact?service=Sell directly to Buchan#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'home-care',
  'Buchan Home Care',
  'Maintenance and smaller projects for existing Buchan homeowners.',
  '{"hero":{"eyebrow":"Buchan Home Care","title":"Care after","titleEmphasis":"the keys.","image_url":"/assets/ph-arch-1.png"},"intro":"Maintenance, seasonal upkeep, and smaller projects for homeowners who want Buchan quality on an ongoing basis, whether we built your home or you simply want the same standard of care.","sections":[{"title":"What We Handle","body":"Seasonal maintenance, minor repairs, fixture upgrades, and selective remodels scoped for occupied homes. The same trades and supers who know Buchan standards, scaled for ongoing care.","bullets":["Seasonal maintenance visits","Minor repairs & adjustments","Selective upgrades","Pre-sale preparation"],"image_url":"/assets/ph-arch-2.png"},{"title":"Who It Is For","body":"Past Buchan clients, Eastside homeowners with complex systems, and owners who prefer a single trusted team over a rotating list of contractors."},{"title":"Response & Scheduling","body":"Home Care requests are routed to a dedicated coordinator, not a generic inbox. Urgent envelope or water issues are prioritized; planned work is scheduled in advance with clear arrival windows."},{"title":"Warranty Tie-In","body":"For Buchan-built homes still under warranty, Home Care complements, never replaces, warranty coverage. We document every visit so warranty and maintenance history stay clear."}],"ctaTitle":"Request Home Care","ctaLink":"/contact?service=Buchan Home Care#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'land-acquisition',
  'Landowners, Sell Your Land',
  'Property owners interested in selling land directly to John Buchan Homes.',
  '{"hero":{"eyebrow":"Landowners","title":"Sell your","titleEmphasis":"land.","image_url":"/assets/ph-arch-3.png"},"intro":"For property owners with no other relationship to JBH who may want to sell land directly, without listing it. A confidential path for parcels that may fit future custom or spec opportunities.","sections":[{"title":"Parcel Types We Evaluate","body":"Buildable residential lots, teardown candidates, and infill parcels across the Eastside. Size, slope, and utility access all factor into whether a direct conversation makes sense.","bullets":["Single-family residential lots","Teardown / rebuild candidates","Infill & subdivision remnants"],"image_url":"/assets/ph-arch-4.png"},{"title":"Evaluation Process","body":"Tell us location, acreage, zoning, and timing. Our team reviews feasibility internally before a follow-up, no mass mailers, no automated lowball offers."},{"title":"How a Direct Sale Works","body":"If there is mutual interest, we outline terms as a principal buyer, separate from any listing or brokerage relationship. You should consult your own legal and tax advisors before proceeding."},{"title":"Confidentiality","body":"Land conversations stay private. We do not market your property to third parties while evaluating a direct purchase."}],"ctaTitle":"Submit your land","ctaLink":"/contact?service=I have land to sell#inquiry"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'second-opinion',
  'Need a Second Opinion?',
  'Outside review for a project already underway, builder transition or gut-check.',
  '{"hero":{"eyebrow":"Second Opinion","title":"Need another","titleEmphasis":"perspective?","image_url":"/assets/ph-arch-2.png"},"intro":"Whether you are considering a builder transition or simply want an outside gut-check on a project underway, reach a person, not a form funnel.","sections":[{"title":"When to Call","body":"Schedule slips with no explanation, change orders stacking up, quality concerns on site, or a gut feeling that the project has drifted from plan, these are all valid reasons for an outside review.","image_url":"/assets/ph-arch-3.png"},{"title":"What We Review","body":"We walk the site, review contracts and draw schedules, and assess remaining scope against realistic budget and timeline. You receive an honest assessment, even if the answer is to stay with your current builder.","bullets":["Site walk & photo documentation","Schedule & budget review","Remaining scope assessment"]},{"title":"Builder Transition","body":"We have successfully taken over mid-construction projects, read our builder-transition case study for a real Clyde Hill example of schedule recovery and finish quality."},{"title":"Personal Contact","body":"Call 425.827.2266 directly or submit a brief description through our contact form, routed to a senior team member for review within one business day."}],"ctaTitle":"Read the case study","ctaLink":"/case-studies/builder-transition"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hub_pages (slug, meta_title, meta_description, content)
VALUES (
  'property-feasibility',
  'What Can I Build on My Property?',
  'Evaluate build, ADU, renovation, or sell options for your Eastside property.',
  '{"hero":{"eyebrow":"Property Evaluation","title":"What can you","titleEmphasis":"build here?","image_url":"/assets/ph-arch-4.png"},"intro":"Not sure where to start? Tell us about your property and goals, we will help you find the path that fits: build, renovate, add an ADU, or explore selling instead.","sections":[{"title":"Build Custom","body":"Ground-up home on your lot, our core practice since 1961.","bullets":["Feasibility & zoning review","Progressive cost estimating","→ Custom Homes"],"image_url":"/assets/ph-arch-1.png"},{"title":"ADU or DADU","body":"Additional dwelling on existing lot for family or rental income.","bullets":["Setback & utility check","Coordinated design & construction","→ ADUs & DADUs"]},{"title":"Renovate or Rebuild","body":"Transform or replace an existing structure while staying on the land you love.","bullets":["Condition assessment","Phasing for occupied homes","→ Renovations"]},{"title":"Sell Instead","body":"Explore selling your property or land directly or on the open market.","bullets":["→ Land Acquisition","→ Sell to Buchan","→ Sell Your Home"]}],"ctaTitle":"Start a conversation","ctaLink":"/contact"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

