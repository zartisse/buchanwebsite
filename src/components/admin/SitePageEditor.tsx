import { useState } from 'react';
import type {
  AboutPageContent,
  AwardsPageContent,
  ContactPageContent,
  FaqPageContent,
  HomePageContent,
  NeighborhoodsPageContent,
  ProcessPageContent,
  ServiceDetailPageContent,
  ServicesPageContent,
  SitePage,
  SitePageSlug,
  TestimonialsPageContent,
  WarrantyPageContent,
} from '../../types';
import { getDemoSitePage } from '../../data/sitePagesDemo';
import { mergeHomeContent } from '../../data/homeContentDefaults';
import { PageMeta } from '../ui/PageMeta';
import { HeroFields, ImageField, MetaFields } from './AdminFormFields';
import { MediaDropzone } from './MediaDropzone';
import styles from '../../styles/admin.module.css';

interface SitePageEditorProps {
  slug: SitePageSlug;
  page?: SitePage | null;
  onSave: (data: Pick<SitePage, 'slug' | 'meta_title' | 'meta_description' | 'content'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

export function SitePageEditor({ slug, page, onSave, onCancel }: SitePageEditorProps) {
  const demo = getDemoSitePage(slug);
  const initial = page ?? demo;

  const [metaTitle, setMetaTitle] = useState(initial.meta_title);
  const [metaDescription, setMetaDescription] = useState(initial.meta_description);
  const [content, setContent] = useState(initial.content);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        id: page?.id,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        content,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageMeta title={`Edit ${slug}`} />
      <h1 className={styles.pageTitle}>Edit Page: {slug}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <MetaFields
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          onMetaTitle={setMetaTitle}
          onMetaDescription={setMetaDescription}
        />
        {slug === 'home' && (
          <HomeEditor content={mergeHomeContent(content as HomePageContent)} onChange={setContent} />
        )}
        {slug === 'about' && (
          <AboutEditor content={content as AboutPageContent} onChange={setContent} />
        )}
        {slug === 'services' && (
          <ServicesEditor content={content as ServicesPageContent} onChange={setContent} />
        )}
        {(slug === 'build' || slug === 'design' || slug === 'remodel') && (
          <ServiceDetailEditor content={content as ServiceDetailPageContent} onChange={setContent} />
        )}
        {slug === 'process' && (
          <ProcessEditor content={content as ProcessPageContent} onChange={setContent} />
        )}
        {slug === 'neighborhoods' && (
          <NeighborhoodsEditor content={content as NeighborhoodsPageContent} onChange={setContent} />
        )}
        {slug === 'testimonials' && (
          <TestimonialsEditor content={content as TestimonialsPageContent} onChange={setContent} />
        )}
        {slug === 'contact' && (
          <ContactEditor content={content as ContactPageContent} onChange={setContent} />
        )}
        {slug === 'faq' && (
          <FaqEditor content={content as FaqPageContent} onChange={setContent} />
        )}
        {slug === 'warranty' && (
          <WarrantyEditor content={content as WarrantyPageContent} onChange={setContent} />
        )}
        {slug === 'awards' && (
          <AwardsEditor content={content as AwardsPageContent} onChange={setContent} />
        )}
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className={styles.btn} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}

function HomeEditor({ content, onChange }: { content: HomePageContent; onChange: (c: HomePageContent) => void }) {
  const set = (patch: Partial<HomePageContent>) => onChange({ ...content, ...patch });

  return (
    <>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Hero</legend>
        <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero: { ...content.hero, ...hero } })} />
        <div className={styles.field}>
          <label className={styles.label}>Subtitle</label>
          <input className={styles.input} value={content.hero.subtitle} onChange={(e) => onChange({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} />
        </div>
        <MediaDropzone label="Hero video" folder="pages/home/video" accept="video" value={content.hero.video_url && !content.hero.video_url.includes('youtube') ? content.hero.video_url : ''} onChange={(url) => onChange({ ...content, hero: { ...content.hero, video_url: url || content.hero.video_url } })} />
        <div className={styles.field}>
          <label className={styles.label}>Hero video URL (YouTube or direct MP4)</label>
          <input className={styles.input} value={content.hero.video_url ?? ''} placeholder="https://www.youtube.com/watch?v=..." onChange={(e) => onChange({ ...content, hero: { ...content.hero, video_url: e.target.value || undefined } })} />
        </div>
        <ImageField label="Hero poster (fallback image)" value={content.hero.image_url} onChange={(url) => onChange({ ...content, hero: { ...content.hero, image_url: url } })} folder="pages/home" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className={styles.field}>
            <label className={styles.label}>Primary CTA label</label>
            <input className={styles.input} value={content.hero.cta_primary_label} onChange={(e) => onChange({ ...content, hero: { ...content.hero, cta_primary_label: e.target.value } })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Primary CTA URL</label>
            <input className={styles.input} value={content.hero.cta_primary_url} onChange={(e) => onChange({ ...content, hero: { ...content.hero, cta_primary_url: e.target.value } })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Secondary CTA label</label>
            <input className={styles.input} value={content.hero.cta_secondary_label ?? ''} onChange={(e) => onChange({ ...content, hero: { ...content.hero, cta_secondary_label: e.target.value } })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Secondary CTA URL</label>
            <input className={styles.input} value={content.hero.cta_secondary_url ?? ''} onChange={(e) => onChange({ ...content, hero: { ...content.hero, cta_secondary_url: e.target.value } })} />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Credibility line</legend>
        <input className={styles.input} value={content.credibility_line} onChange={(e) => set({ credibility_line: e.target.value })} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Featured Work labels</legend>
        <p style={{ fontSize: 13, color: 'rgba(26,36,32,0.5)', marginBottom: 12 }}>Images come from Properties marked as Featured.</p>
        <div className={styles.field}>
          <label className={styles.label}>Eyebrow</label>
          <input className={styles.input} value={content.featured_work.eyebrow} onChange={(e) => set({ featured_work: { ...content.featured_work, eyebrow: e.target.value } })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={content.featured_work.title} onChange={(e) => set({ featured_work: { ...content.featured_work, title: e.target.value } })} />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>What We Do</legend>
        <div className={styles.field}>
          <label className={styles.label}>Eyebrow</label>
          <input className={styles.input} value={content.what_we_do.eyebrow} onChange={(e) => set({ what_we_do: { ...content.what_we_do, eyebrow: e.target.value } })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Title / emphasis</label>
          <input className={styles.input} value={content.what_we_do.title} onChange={(e) => set({ what_we_do: { ...content.what_we_do, title: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.what_we_do.title_emphasis ?? ''} onChange={(e) => set({ what_we_do: { ...content.what_we_do, title_emphasis: e.target.value } })} />
        </div>
        {content.what_we_do.primary.map((item, i) => (
          <div key={i} className={styles.repeatItem}>
            <div className={styles.field}><label className={styles.label}>Primary card {i + 1} title</label><input className={styles.input} value={item.title} onChange={(e) => { const primary = [...content.what_we_do.primary]; primary[i] = { ...primary[i], title: e.target.value }; set({ what_we_do: { ...content.what_we_do, primary } }); }} /></div>
            <div className={styles.field}><label className={styles.label}>Description</label><textarea className={styles.textarea} value={item.description} rows={2} onChange={(e) => { const primary = [...content.what_we_do.primary]; primary[i] = { ...primary[i], description: e.target.value }; set({ what_we_do: { ...content.what_we_do, primary } }); }} /></div>
            <ImageField label="Image" value={item.image_url} onChange={(url) => { const primary = [...content.what_we_do.primary]; primary[i] = { ...primary[i], image_url: url }; set({ what_we_do: { ...content.what_we_do, primary } }); }} folder="pages/home/what-we-do" />
            <div className={styles.field}><label className={styles.label}>Link</label><input className={styles.input} value={item.link} onChange={(e) => { const primary = [...content.what_we_do.primary]; primary[i] = { ...primary[i], link: e.target.value }; set({ what_we_do: { ...content.what_we_do, primary } }); }} /></div>
          </div>
        ))}
        {content.what_we_do.secondary.map((item, i) => (
          <div key={i} className={styles.repeatItem}>
            <div className={styles.field}><label className={styles.label}>Secondary card {i + 1}</label><input className={styles.input} value={item.title} onChange={(e) => { const secondary = [...content.what_we_do.secondary]; secondary[i] = { ...secondary[i], title: e.target.value }; set({ what_we_do: { ...content.what_we_do, secondary } }); }} /></div>
            <div className={styles.field}><textarea className={styles.textarea} value={item.description} rows={2} onChange={(e) => { const secondary = [...content.what_we_do.secondary]; secondary[i] = { ...secondary[i], description: e.target.value }; set({ what_we_do: { ...content.what_we_do, secondary } }); }} /></div>
            <div className={styles.field}><input className={styles.input} value={item.link} placeholder="Link" onChange={(e) => { const secondary = [...content.what_we_do.secondary]; secondary[i] = { ...secondary[i], link: e.target.value }; set({ what_we_do: { ...content.what_we_do, secondary } }); }} /></div>
          </div>
        ))}
        <div className={styles.field}><label className={styles.label}>Preconstruction band title</label><input className={styles.input} value={content.what_we_do.preconstruction.title} onChange={(e) => set({ what_we_do: { ...content.what_we_do, preconstruction: { ...content.what_we_do.preconstruction, title: e.target.value } } })} /></div>
        <div className={styles.field}><label className={styles.label}>Preconstruction body</label><textarea className={styles.textarea} value={content.what_we_do.preconstruction.body} rows={2} onChange={(e) => set({ what_we_do: { ...content.what_we_do, preconstruction: { ...content.what_we_do.preconstruction, body: e.target.value } } })} /></div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Client concerns</legend>
        <div className={styles.field}><label className={styles.label}>Eyebrow</label><input className={styles.input} value={content.client_concerns.eyebrow} onChange={(e) => set({ client_concerns: { ...content.client_concerns, eyebrow: e.target.value } })} /></div>
        <div className={styles.field}><label className={styles.label}>Title / emphasis</label><input className={styles.input} value={content.client_concerns.title} onChange={(e) => set({ client_concerns: { ...content.client_concerns, title: e.target.value } })} /><input className={styles.input} style={{ marginTop: 8 }} value={content.client_concerns.title_emphasis ?? ''} onChange={(e) => set({ client_concerns: { ...content.client_concerns, title_emphasis: e.target.value } })} /></div>
        {content.client_concerns.items.map((item, i) => (
          <div key={i} className={styles.repeatItem}>
            <div className={styles.field}><input className={styles.input} value={item.title} placeholder="Title" onChange={(e) => { const items = [...content.client_concerns.items]; items[i] = { ...items[i], title: e.target.value }; set({ client_concerns: { ...content.client_concerns, items } }); }} /></div>
            <div className={styles.field}><textarea className={styles.textarea} value={item.body} rows={2} onChange={(e) => { const items = [...content.client_concerns.items]; items[i] = { ...items[i], body: e.target.value }; set({ client_concerns: { ...content.client_concerns, items } }); }} /></div>
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Better-Planned Path</legend>
        <div className={styles.field}><label className={styles.label}>Eyebrow</label><input className={styles.input} value={content.better_planned_path.eyebrow} onChange={(e) => set({ better_planned_path: { ...content.better_planned_path, eyebrow: e.target.value } })} /></div>
        <div className={styles.field}><label className={styles.label}>Title / emphasis</label><input className={styles.input} value={content.better_planned_path.title} onChange={(e) => set({ better_planned_path: { ...content.better_planned_path, title: e.target.value } })} /><input className={styles.input} style={{ marginTop: 8 }} value={content.better_planned_path.title_emphasis ?? ''} onChange={(e) => set({ better_planned_path: { ...content.better_planned_path, title_emphasis: e.target.value } })} /></div>
        <div className={styles.field}><label className={styles.label}>Intro</label><textarea className={styles.textarea} value={content.better_planned_path.intro} rows={3} onChange={(e) => set({ better_planned_path: { ...content.better_planned_path, intro: e.target.value } })} /></div>
        <ImageField label="Team image" value={content.better_planned_path.team_image_url} onChange={(url) => set({ better_planned_path: { ...content.better_planned_path, team_image_url: url } })} folder="pages/home/path" />
        {content.process_stages.map((stage, i) => (
          <div key={i} className={styles.repeatItem}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8 }}>
              <input className={styles.input} value={stage.n} onChange={(e) => { const process_stages = [...content.process_stages]; process_stages[i] = { ...process_stages[i], n: e.target.value }; set({ process_stages }); }} />
              <input className={styles.input} value={stage.title} onChange={(e) => { const process_stages = [...content.process_stages]; process_stages[i] = { ...process_stages[i], title: e.target.value }; set({ process_stages }); }} />
            </div>
            <textarea className={styles.textarea} value={stage.body} rows={2} onChange={(e) => { const process_stages = [...content.process_stages]; process_stages[i] = { ...process_stages[i], body: e.target.value }; set({ process_stages }); }} />
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Quality in Every Layer</legend>
        <ImageField label="Elevation cutaway photo" value={content.quality_layers.elevation_image_url} onChange={(url) => set({ quality_layers: { ...content.quality_layers, elevation_image_url: url } })} folder="pages/home/quality" />
        {content.quality_layers.layers.map((layer, i) => (
          <div key={layer.id} className={styles.repeatItem}>
            <div className={styles.field}><label className={styles.label}>Hotspot {i + 1}: {layer.label}</label><input className={styles.input} value={layer.label} onChange={(e) => { const layers = [...content.quality_layers.layers]; layers[i] = { ...layers[i], label: e.target.value }; set({ quality_layers: { ...content.quality_layers, layers } }); }} /></div>
            <textarea className={styles.textarea} value={layer.benefit} rows={2} onChange={(e) => { const layers = [...content.quality_layers.layers]; layers[i] = { ...layers[i], benefit: e.target.value }; set({ quality_layers: { ...content.quality_layers, layers } }); }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className={styles.field}><label className={styles.label}>X %</label><input className={styles.input} type="number" value={layer.x} onChange={(e) => { const layers = [...content.quality_layers.layers]; layers[i] = { ...layers[i], x: Number(e.target.value) }; set({ quality_layers: { ...content.quality_layers, layers } }); }} /></div>
              <div className={styles.field}><label className={styles.label}>Y %</label><input className={styles.input} type="number" value={layer.y} onChange={(e) => { const layers = [...content.quality_layers.layers]; layers[i] = { ...layers[i], y: Number(e.target.value) }; set({ quality_layers: { ...content.quality_layers, layers } }); }} /></div>
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Testimonial</legend>
        <div className={styles.field}><label className={styles.label}>Eyebrow</label><input className={styles.input} value={content.testimonial_section.eyebrow} onChange={(e) => set({ testimonial_section: { ...content.testimonial_section, eyebrow: e.target.value } })} /></div>
        <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={content.testimonial_section.title} onChange={(e) => set({ testimonial_section: { ...content.testimonial_section, title: e.target.value } })} /></div>
        <div className={styles.field}><label className={styles.label}>Quote</label><textarea className={styles.textarea} value={content.testimonial_section.quote} rows={3} onChange={(e) => set({ testimonial_section: { ...content.testimonial_section, quote: e.target.value } })} /></div>
        <div className={styles.field}><label className={styles.label}>Citation</label><input className={styles.input} value={content.testimonial_section.cite} onChange={(e) => set({ testimonial_section: { ...content.testimonial_section, cite: e.target.value } })} /></div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Pick Your Path</legend>
        <div className={styles.field}><label className={styles.label}>Intro</label><input className={styles.input} value={content.pick_your_path.intro} onChange={(e) => set({ pick_your_path: { ...content.pick_your_path, intro: e.target.value } })} /></div>
        {content.pick_your_path.tiles.map((tile, i) => (
          <div key={i} className={styles.repeatItem}>
            <input className={styles.input} value={tile.title} placeholder="Title" onChange={(e) => { const tiles = [...content.pick_your_path.tiles]; tiles[i] = { ...tiles[i], title: e.target.value }; set({ pick_your_path: { ...content.pick_your_path, tiles } }); }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={tile.link} placeholder="Link" onChange={(e) => { const tiles = [...content.pick_your_path.tiles]; tiles[i] = { ...tiles[i], link: e.target.value }; set({ pick_your_path: { ...content.pick_your_path, tiles } }); }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 13 }}>
              <input type="checkbox" checked={!!tile.external} onChange={(e) => { const tiles = [...content.pick_your_path.tiles]; tiles[i] = { ...tiles[i], external: e.target.checked }; set({ pick_your_path: { ...content.pick_your_path, tiles } }); }} />
              External link
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Closing CTA</legend>
        <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={content.closing_cta.title} onChange={(e) => set({ closing_cta: { ...content.closing_cta, title: e.target.value } })} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className={styles.field}><label className={styles.label}>Primary label</label><input className={styles.input} value={content.closing_cta.primary_label} onChange={(e) => set({ closing_cta: { ...content.closing_cta, primary_label: e.target.value } })} /></div>
          <div className={styles.field}><label className={styles.label}>Primary URL</label><input className={styles.input} value={content.closing_cta.primary_url} onChange={(e) => set({ closing_cta: { ...content.closing_cta, primary_url: e.target.value } })} /></div>
          <div className={styles.field}><label className={styles.label}>Phone display</label><input className={styles.input} value={content.closing_cta.phone} onChange={(e) => set({ closing_cta: { ...content.closing_cta, phone: e.target.value } })} /></div>
          <div className={styles.field}><label className={styles.label}>Phone href</label><input className={styles.input} value={content.closing_cta.phone_href} onChange={(e) => set({ closing_cta: { ...content.closing_cta, phone_href: e.target.value } })} /></div>
        </div>
      </fieldset>
    </>
  );
}

function AboutEditor({ content, onChange }: { content: AboutPageContent; onChange: (c: AboutPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Timeline</legend>
        <div className={styles.field}>
          <label className={styles.label}>Eyebrow / Title</label>
          <input className={styles.input} value={content.timeline.eyebrow} onChange={(e) => onChange({ ...content, timeline: { ...content.timeline, eyebrow: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.timeline.title} onChange={(e) => onChange({ ...content, timeline: { ...content.timeline, title: e.target.value } })} />
        </div>
        {content.timeline.items.map((item, i) => (
          <div key={i} className={styles.repeatItem}>
            <input className={styles.input} value={item.year} placeholder="Year" onChange={(e) => {
              const items = [...content.timeline.items];
              items[i] = { ...item, year: e.target.value };
              onChange({ ...content, timeline: { ...content.timeline, items } });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={item.title} placeholder="Title" onChange={(e) => {
              const items = [...content.timeline.items];
              items[i] = { ...item, title: e.target.value };
              onChange({ ...content, timeline: { ...content.timeline, items } });
            }} />
            <textarea className={styles.textarea} style={{ marginTop: 8 }} value={item.body} onChange={(e) => {
              const items = [...content.timeline.items];
              items[i] = { ...item, body: e.target.value };
              onChange({ ...content, timeline: { ...content.timeline, items } });
            }} rows={2} />
            <div className={styles.repeatActions}>
              <button type="button" className={styles.btnDanger} onClick={() => onChange({ ...content, timeline: { ...content.timeline, items: content.timeline.items.filter((_, j) => j !== i) } })}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.btn} onClick={() => onChange({ ...content, timeline: { ...content.timeline, items: [...content.timeline.items, { year: '', title: '', body: '' }] } })}>Add item</button>
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Mission</legend>
        <div className={styles.field}>
          <label className={styles.label}>Eyebrow</label>
          <input className={styles.input} value={content.mission.eyebrow} onChange={(e) => onChange({ ...content, mission: { ...content.mission, eyebrow: e.target.value } })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Title / emphasis</label>
          <input className={styles.input} value={content.mission.title} onChange={(e) => onChange({ ...content, mission: { ...content.mission, title: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.mission.title_emphasis ?? ''} onChange={(e) => onChange({ ...content, mission: { ...content.mission, title_emphasis: e.target.value } })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Body</label>
          <textarea className={styles.textarea} value={content.mission.body} onChange={(e) => onChange({ ...content, mission: { ...content.mission, body: e.target.value } })} rows={4} />
        </div>
        <ImageField label="Image" value={content.mission.image_url} onChange={(url) => onChange({ ...content, mission: { ...content.mission, image_url: url } })} folder="pages/about" />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Team</legend>
        <div className={styles.field}>
          <label className={styles.label}>Eyebrow / Title / emphasis</label>
          <input className={styles.input} value={content.team.eyebrow} onChange={(e) => onChange({ ...content, team: { ...content.team, eyebrow: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.team.title} onChange={(e) => onChange({ ...content, team: { ...content.team, title: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.team.title_emphasis ?? ''} onChange={(e) => onChange({ ...content, team: { ...content.team, title_emphasis: e.target.value } })} />
        </div>
        {content.team.members.map((m, i) => (
          <div key={i} className={styles.repeatItem}>
            <input className={styles.input} value={m.name} placeholder="Name" onChange={(e) => {
              const members = [...content.team.members];
              members[i] = { ...m, name: e.target.value };
              onChange({ ...content, team: { ...content.team, members } });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={m.role} placeholder="Role" onChange={(e) => {
              const members = [...content.team.members];
              members[i] = { ...m, role: e.target.value };
              onChange({ ...content, team: { ...content.team, members } });
            }} />
            <ImageField label="Photo" value={m.image_url} onChange={(url) => {
              const members = [...content.team.members];
              members[i] = { ...m, image_url: url };
              onChange({ ...content, team: { ...content.team, members } });
            }} folder="pages/team" />
            <div className={styles.repeatActions}>
              <button type="button" className={styles.btnDanger} onClick={() => onChange({ ...content, team: { ...content.team, members: content.team.members.filter((_, j) => j !== i) } })}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.btn} onClick={() => onChange({ ...content, team: { ...content.team, members: [...content.team.members, { name: '', role: '', image_url: '/assets/ph-portrait.svg' }] } })}>Add member</button>
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Giving Back</legend>
        <div className={styles.field}>
          <label className={styles.label}>Eyebrow / Title / emphasis</label>
          <input className={styles.input} value={content.giving_back.eyebrow} onChange={(e) => onChange({ ...content, giving_back: { ...content.giving_back, eyebrow: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.giving_back.title} onChange={(e) => onChange({ ...content, giving_back: { ...content.giving_back, title: e.target.value } })} />
          <input className={styles.input} style={{ marginTop: 8 }} value={content.giving_back.title_emphasis ?? ''} onChange={(e) => onChange({ ...content, giving_back: { ...content.giving_back, title_emphasis: e.target.value } })} />
        </div>
        <ImageField label="Background image" value={content.giving_back.image_url} onChange={(url) => onChange({ ...content, giving_back: { ...content.giving_back, image_url: url } })} folder="pages/about" />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>CTA blocks</legend>
        <div className={styles.field}>
          <label className={styles.label}>Join team title / body</label>
          <input className={styles.input} value={content.cta.join_title} onChange={(e) => onChange({ ...content, cta: { ...content.cta, join_title: e.target.value } })} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={content.cta.join_body} onChange={(e) => onChange({ ...content, cta: { ...content.cta, join_body: e.target.value } })} rows={2} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>We buy land title / body</label>
          <input className={styles.input} value={content.cta.land_title} onChange={(e) => onChange({ ...content, cta: { ...content.cta, land_title: e.target.value } })} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={content.cta.land_body} onChange={(e) => onChange({ ...content, cta: { ...content.cta, land_body: e.target.value } })} rows={2} />
        </div>
      </fieldset>
    </>
  );
}

function ServicesEditor({ content, onChange }: { content: ServicesPageContent; onChange: (c: ServicesPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Service blocks</legend>
        {content.items.map((item, i) => (
          <div key={i} className={styles.repeatItem}>
            <input className={styles.input} value={item.title} placeholder="Title" onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...item, title: e.target.value };
              onChange({ ...content, items });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={item.slug} placeholder="Slug" onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...item, slug: e.target.value };
              onChange({ ...content, items });
            }} />
            <textarea className={styles.textarea} style={{ marginTop: 8 }} value={item.description} onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...item, description: e.target.value };
              onChange({ ...content, items });
            }} rows={2} />
            <ImageField label="Image" value={item.image_url} onChange={(url) => {
              const items = [...content.items];
              items[i] = { ...item, image_url: url };
              onChange({ ...content, items });
            }} folder="pages/services" />
          </div>
        ))}
      </fieldset>
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function ServiceDetailEditor({ content, onChange }: { content: ServiceDetailPageContent; onChange: (c: ServiceDetailPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <ImageField label="Hero image" value={content.image_url} onChange={(url) => onChange({ ...content, image_url: url })} folder="pages/services" />
      <StepsEditor steps={content.steps} onChange={(steps) => onChange({ ...content, steps })} />
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function StepsEditor({
  steps,
  onChange,
}: {
  steps: { n: string; title: string; body: string }[];
  onChange: (steps: { n: string; title: string; body: string }[]) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Steps</legend>
      {steps.map((step, i) => (
        <div key={i} className={styles.repeatItem}>
          <input className={styles.input} value={step.n} placeholder="Number" onChange={(e) => {
            const next = [...steps];
            next[i] = { ...step, n: e.target.value };
            onChange(next);
          }} />
          <input className={styles.input} style={{ marginTop: 8 }} value={step.title} placeholder="Title" onChange={(e) => {
            const next = [...steps];
            next[i] = { ...step, title: e.target.value };
            onChange(next);
          }} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={step.body} onChange={(e) => {
            const next = [...steps];
            next[i] = { ...step, body: e.target.value };
            onChange(next);
          }} rows={2} />
          <div className={styles.repeatActions}>
            <button type="button" className={styles.btnDanger} onClick={() => onChange(steps.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className={styles.btn} onClick={() => onChange([...steps, { n: String(steps.length + 1).padStart(2, '0'), title: '', body: '' }])}>Add step</button>
    </fieldset>
  );
}

function ProcessEditor({ content, onChange }: { content: ProcessPageContent; onChange: (c: ProcessPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Process steps</legend>
        {content.steps.map((step, i) => (
          <div key={i} className={styles.repeatItem}>
            <input className={styles.input} value={step.n} placeholder="Number" onChange={(e) => {
              const steps = [...content.steps];
              steps[i] = { ...step, n: e.target.value };
              onChange({ ...content, steps });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={step.tag} placeholder="Tag" onChange={(e) => {
              const steps = [...content.steps];
              steps[i] = { ...step, tag: e.target.value };
              onChange({ ...content, steps });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={step.title} placeholder="Title" onChange={(e) => {
              const steps = [...content.steps];
              steps[i] = { ...step, title: e.target.value };
              onChange({ ...content, steps });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={step.duration} placeholder="Duration" onChange={(e) => {
              const steps = [...content.steps];
              steps[i] = { ...step, duration: e.target.value };
              onChange({ ...content, steps });
            }} />
            <textarea className={styles.textarea} style={{ marginTop: 8 }} value={step.body} onChange={(e) => {
              const steps = [...content.steps];
              steps[i] = { ...step, body: e.target.value };
              onChange({ ...content, steps });
            }} rows={2} />
            <div className={styles.repeatActions}>
              <button type="button" className={styles.btnDanger} onClick={() => onChange({ ...content, steps: content.steps.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.btn} onClick={() => onChange({ ...content, steps: [...content.steps, { n: '', tag: '', title: '', duration: '', body: '' }] })}>Add step</button>
      </fieldset>
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
      <ImageField label="Mid-page band image" value={content.band_image_url ?? '/assets/ph-arch-2.png'} onChange={(url) => onChange({ ...content, band_image_url: url })} folder="pages/process" />
    </>
  );
}

function NeighborhoodsEditor({ content, onChange }: { content: NeighborhoodsPageContent; onChange: (c: NeighborhoodsPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Neighborhoods</legend>
        {content.areas.map((area, i) => (
          <div key={i} className={styles.repeatItem}>
            <input className={styles.input} value={area.name} placeholder="Name" onChange={(e) => {
              const areas = [...content.areas];
              areas[i] = { ...area, name: e.target.value };
              onChange({ ...content, areas });
            }} />
            <textarea className={styles.textarea} style={{ marginTop: 8 }} value={area.body} onChange={(e) => {
              const areas = [...content.areas];
              areas[i] = { ...area, body: e.target.value };
              onChange({ ...content, areas });
            }} rows={2} />
            <ImageField label="Image" value={area.image_url} onChange={(url) => {
              const areas = [...content.areas];
              areas[i] = { ...area, image_url: url };
              onChange({ ...content, areas });
            }} folder="pages/neighborhoods" />
            <div className={styles.repeatActions}>
              <button type="button" className={styles.btnDanger} onClick={() => onChange({ ...content, areas: content.areas.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.btn} onClick={() => onChange({ ...content, areas: [...content.areas, { name: '', body: '', image_url: '/assets/ph-arch-1.png' }] })}>Add area</button>
      </fieldset>
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function TestimonialsEditor({ content, onChange }: { content: TestimonialsPageContent; onChange: (c: TestimonialsPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Featured quote</legend>
        <textarea className={styles.textarea} value={content.featured.quote} onChange={(e) => onChange({ ...content, featured: { ...content.featured, quote: e.target.value } })} rows={3} />
        <div className={styles.field}>
          <label className={styles.label}>Citation</label>
          <input className={styles.input} value={content.featured.cite} onChange={(e) => onChange({ ...content, featured: { ...content.featured, cite: e.target.value } })} />
        </div>
        <ImageField label="Image" value={content.featured.image_url} onChange={(url) => onChange({ ...content, featured: { ...content.featured, image_url: url } })} folder="pages/testimonials" />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Testimonials grid</legend>
        {content.quotes.map((q, i) => (
          <div key={i} className={styles.repeatItem}>
            <textarea className={styles.textarea} value={q.quote} placeholder="Quote" onChange={(e) => {
              const quotes = [...content.quotes];
              quotes[i] = { ...q, quote: e.target.value };
              onChange({ ...content, quotes });
            }} rows={2} />
            <input className={styles.input} style={{ marginTop: 8 }} value={q.name} placeholder="Name" onChange={(e) => {
              const quotes = [...content.quotes];
              quotes[i] = { ...q, name: e.target.value };
              onChange({ ...content, quotes });
            }} />
            <input className={styles.input} style={{ marginTop: 8 }} value={q.city} placeholder="City" onChange={(e) => {
              const quotes = [...content.quotes];
              quotes[i] = { ...q, city: e.target.value };
              onChange({ ...content, quotes });
            }} />
            <div className={styles.repeatActions}>
              <button type="button" className={styles.btnDanger} onClick={() => onChange({ ...content, quotes: content.quotes.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.btn} onClick={() => onChange({ ...content, quotes: [...content.quotes, { name: '', city: '', quote: '' }] })}>Add testimonial</button>
      </fieldset>
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function ContactEditor({ content, onChange }: { content: ContactPageContent; onChange: (c: ContactPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <div className={styles.field}>
        <label className={styles.label}>Inquiry section title</label>
        <input className={styles.input} value={content.inquiry_title} onChange={(e) => onChange({ ...content, inquiry_title: e.target.value })} />
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Form topic options</legend>
        <textarea
          className={styles.textarea}
          value={content.service_options.join('\n')}
          onChange={(e) => onChange({ ...content, service_options: e.target.value.split('\n').filter(Boolean) })}
          rows={6}
        />
      </fieldset>
      <div className={styles.field}>
        <label className={styles.label}>Visit section title</label>
        <input className={styles.input} value={content.visit_title} onChange={(e) => onChange({ ...content, visit_title: e.target.value })} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className={styles.field}>
          <label className={styles.label}>Phone display</label>
          <input className={styles.input} value={content.phone} onChange={(e) => onChange({ ...content, phone: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Phone href</label>
          <input className={styles.input} value={content.phone_href} onChange={(e) => onChange({ ...content, phone_href: e.target.value })} />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Office (use line breaks)</label>
        <textarea className={styles.textarea} value={content.office} onChange={(e) => onChange({ ...content, office: e.target.value })} rows={3} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function FaqEditor({ content, onChange }: { content: FaqPageContent; onChange: (c: FaqPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <div className={styles.field}>
        <label className={styles.label}>Intro</label>
        <textarea className={styles.textarea} value={content.intro} onChange={(e) => onChange({ ...content, intro: e.target.value })} rows={3} />
      </div>
      {content.categories.map((cat, ci) => (
        <fieldset key={ci} className={styles.fieldset}>
          <legend className={styles.legend}>Category {ci + 1}</legend>
          <input className={styles.input} value={cat.title} placeholder="Category title" onChange={(e) => {
            const categories = [...content.categories];
            categories[ci] = { ...cat, title: e.target.value };
            onChange({ ...content, categories });
          }} />
          {cat.items.map((item, ii) => (
            <div key={ii} className={styles.repeatItem}>
              <input className={styles.input} value={item.question} placeholder="Question" onChange={(e) => {
                const categories = [...content.categories];
                const items = [...cat.items];
                items[ii] = { ...item, question: e.target.value };
                categories[ci] = { ...cat, items };
                onChange({ ...content, categories });
              }} />
              <textarea className={styles.textarea} style={{ marginTop: 8 }} value={item.answer} onChange={(e) => {
                const categories = [...content.categories];
                const items = [...cat.items];
                items[ii] = { ...item, answer: e.target.value };
                categories[ci] = { ...cat, items };
                onChange({ ...content, categories });
              }} rows={3} />
              <div className={styles.repeatActions}>
                <button type="button" className={styles.btnDanger} onClick={() => {
                  const categories = [...content.categories];
                  categories[ci] = { ...cat, items: cat.items.filter((_, j) => j !== ii) };
                  onChange({ ...content, categories });
                }}>Remove</button>
              </div>
            </div>
          ))}
          <button type="button" className={styles.btn} onClick={() => {
            const categories = [...content.categories];
            categories[ci] = { ...cat, items: [...cat.items, { question: '', answer: '' }] };
            onChange({ ...content, categories });
          }}>Add question</button>
        </fieldset>
      ))}
      <button type="button" className={styles.btn} onClick={() => onChange({ ...content, categories: [...content.categories, { title: '', items: [] }] })}>Add category</button>
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function WarrantyEditor({ content, onChange }: { content: WarrantyPageContent; onChange: (c: WarrantyPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <div className={styles.field}>
        <label className={styles.label}>Intro</label>
        <textarea className={styles.textarea} value={content.intro} onChange={(e) => onChange({ ...content, intro: e.target.value })} rows={4} />
      </div>
      {content.sections.map((s, i) => (
        <div key={i} className={styles.repeatItem}>
          <input className={styles.input} value={s.title} placeholder="Section title" onChange={(e) => {
            const sections = [...content.sections];
            sections[i] = { ...s, title: e.target.value };
            onChange({ ...content, sections });
          }} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={s.body} onChange={(e) => {
            const sections = [...content.sections];
            sections[i] = { ...s, body: e.target.value };
            onChange({ ...content, sections });
          }} rows={3} />
        </div>
      ))}
      {content.coverage_items.map((item, i) => (
        <div key={i} className={styles.repeatItem}>
          <input className={styles.input} value={item.title} placeholder="Coverage title" onChange={(e) => {
            const coverage_items = [...content.coverage_items];
            coverage_items[i] = { ...item, title: e.target.value };
            onChange({ ...content, coverage_items });
          }} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={item.description} onChange={(e) => {
            const coverage_items = [...content.coverage_items];
            coverage_items[i] = { ...item, description: e.target.value };
            onChange({ ...content, coverage_items });
          }} rows={2} />
        </div>
      ))}
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}

function AwardsEditor({ content, onChange }: { content: AwardsPageContent; onChange: (c: AwardsPageContent) => void }) {
  return (
    <>
      <HeroFields hero={content.hero} onChange={(hero) => onChange({ ...content, hero })} />
      <div className={styles.field}>
        <label className={styles.label}>Intro</label>
        <textarea className={styles.textarea} value={content.intro} onChange={(e) => onChange({ ...content, intro: e.target.value })} rows={3} />
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Footer badge logos</legend>
        {(content.badges ?? []).map((badge, i) => (
          <div key={i} className={styles.repeatItem}>
            <ImageField label="Logo image (optional)" value={badge.image_url ?? ''} onChange={(url) => {
              const badges = [...(content.badges ?? [])];
              badges[i] = { ...badges[i], image_url: url || undefined };
              onChange({ ...content, badges });
            }} folder="pages/awards/badges" />
            <div className={styles.field}><label className={styles.label}>Alt text</label><input className={styles.input} value={badge.alt} onChange={(e) => { const badges = [...(content.badges ?? [])]; badges[i] = { ...badges[i], alt: e.target.value }; onChange({ ...content, badges }); }} /></div>
            <div className={styles.field}><label className={styles.label}>Link URL</label><input className={styles.input} value={badge.href ?? ''} onChange={(e) => { const badges = [...(content.badges ?? [])]; badges[i] = { ...badges[i], href: e.target.value || undefined }; onChange({ ...content, badges }); }} /></div>
          </div>
        ))}
        <button type="button" className={styles.btn} onClick={() => onChange({ ...content, badges: [...(content.badges ?? []), { alt: '', href: '' }] })}>Add badge</button>
      </fieldset>
      {content.awards.map((a, i) => (
        <div key={i} className={styles.repeatItem}>
          <input className={styles.input} value={a.title} placeholder="Award title" onChange={(e) => {
            const awards = [...content.awards];
            awards[i] = { ...a, title: e.target.value };
            onChange({ ...content, awards });
          }} />
          <input className={styles.input} style={{ marginTop: 8 }} value={a.year} placeholder="Year" onChange={(e) => {
            const awards = [...content.awards];
            awards[i] = { ...a, year: e.target.value };
            onChange({ ...content, awards });
          }} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={a.description} onChange={(e) => {
            const awards = [...content.awards];
            awards[i] = { ...a, description: e.target.value };
            onChange({ ...content, awards });
          }} rows={2} />
        </div>
      ))}
      {content.press.map((p, i) => (
        <div key={i} className={styles.repeatItem}>
          <input className={styles.input} value={p.title} placeholder="Press title" onChange={(e) => {
            const press = [...content.press];
            press[i] = { ...p, title: e.target.value };
            onChange({ ...content, press });
          }} />
          <input className={styles.input} style={{ marginTop: 8 }} value={p.source} placeholder="Source" onChange={(e) => {
            const press = [...content.press];
            press[i] = { ...p, source: e.target.value };
            onChange({ ...content, press });
          }} />
          <input className={styles.input} style={{ marginTop: 8 }} value={p.date} placeholder="Date" onChange={(e) => {
            const press = [...content.press];
            press[i] = { ...p, date: e.target.value };
            onChange({ ...content, press });
          }} />
          <input className={styles.input} style={{ marginTop: 8 }} value={p.url ?? ''} placeholder="URL (optional)" onChange={(e) => {
            const press = [...content.press];
            press[i] = { ...p, url: e.target.value };
            onChange({ ...content, press });
          }} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={p.excerpt} onChange={(e) => {
            const press = [...content.press];
            press[i] = { ...p, excerpt: e.target.value };
            onChange({ ...content, press });
          }} rows={2} />
        </div>
      ))}
      {content.credentials.map((c, i) => (
        <div key={i} className={styles.repeatItem}>
          <input className={styles.input} value={c.title} onChange={(e) => {
            const credentials = [...content.credentials];
            credentials[i] = { ...c, title: e.target.value };
            onChange({ ...content, credentials });
          }} />
          <textarea className={styles.textarea} style={{ marginTop: 8 }} value={c.body} onChange={(e) => {
            const credentials = [...content.credentials];
            credentials[i] = { ...c, body: e.target.value };
            onChange({ ...content, credentials });
          }} rows={2} />
        </div>
      ))}
      <div className={styles.field}>
        <label className={styles.label}>CTA title</label>
        <input className={styles.input} value={content.cta_title} onChange={(e) => onChange({ ...content, cta_title: e.target.value })} />
      </div>
    </>
  );
}
