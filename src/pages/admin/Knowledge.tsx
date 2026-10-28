import { Fragment, useEffect, useState } from 'react';
import { PageMeta } from '../../components/ui/PageMeta';
import { toast } from '../../components/ui/Toast';
import { useKnowledgeSources } from '../../hooks/useKnowledgeSources';
import { useChatbotSettings } from '../../hooks/useChatbotSettings';
import { uploadMedia, isVideoUrl } from '../../lib/utils';
import type { CrawlProgress, KnowledgeSource, KnowledgeSourceType } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import styles from '../../styles/admin.module.css';

const TYPE_LABELS: Record<KnowledgeSourceType, string> = {
  text: 'Text',
  url: 'Web page URL',
  pdf: 'PDF',
  image: 'Image + description',
  cms_sync: 'Website sync',
  crawl: 'Website crawl',
};

const EMPTY_FORM = {
  id: '',
  type: 'text' as KnowledgeSourceType,
  title: '',
  source_url: '',
  storage_path: '',
  body_text: '',
  imageDescription: '',
  maxPages: '200',
  scope: 'section' as 'section' | 'site',
};

function crawlSummary(progress: CrawlProgress): string {
  const read = progress.indexed + progress.error;
  const errors = progress.error ? ` · ${progress.error} could not be read` : '';
  return `${progress.indexed} learned, ${read} of ${progress.total} pages checked${errors}`;
}

function countPages(pages: KnowledgeSource[]): CrawlProgress {
  const counts: CrawlProgress = { total: pages.length, pending: 0, indexing: 0, indexed: 0, error: 0 };
  for (const p of pages) counts[p.status]++;
  return counts;
}

export function AdminKnowledge() {
  const {
    sources,
    pagesByCrawl,
    loading,
    saveSource,
    deleteSource,
    indexSource,
    syncWebsiteContent,
    refetch,
    activeCrawl,
    runCrawl,
    stopCrawl,
  } = useKnowledgeSources();
  const [expandedCrawl, setExpandedCrawl] = useState('');
  const { settings, saveSettings } = useChatbotSettings(true);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState('');
  const [logs, setLogs] = useState<{ role: string; message: string; created_at: string }[]>([]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const loadLogs = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from('chat_logs')
      .select('role, message, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    setLogs(data ?? []);
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    setBusy('settings');
    try {
      await saveSettings(settingsForm);
      toast('Chatbot settings saved');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save settings');
    } finally {
      setBusy('');
    }
  };

  const handleSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Title is required');
      return;
    }
    if (form.type === 'crawl') {
      await handleCrawlSubmit();
      return;
    }
    setBusy('source');
    try {
      const id = await saveSource({
        id: form.id || undefined,
        type: form.type,
        title: form.title.trim(),
        source_url: form.source_url.trim(),
        storage_path: form.storage_path.trim(),
        body_text: form.type === 'image' ? form.imageDescription.trim() : form.body_text.trim(),
        metadata: form.type === 'image' ? { description: form.imageDescription.trim() } : {},
      });
      await indexSource(id);
      toast('Source saved and indexed');
      setForm(EMPTY_FORM);
      await refetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save source');
    } finally {
      setBusy('');
    }
  };

  const crawl = async (sourceId: string, resume = false) => {
    setExpandedCrawl(sourceId);
    try {
      const result = await runCrawl(sourceId, { resume });
      toast(result ? `Crawl finished: ${crawlSummary(result)}` : 'Crawl finished');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Crawl failed');
    }
  };

  const handleCrawlSubmit = async () => {
    let url: URL;
    try {
      url = new URL(form.source_url.trim());
      if (!/^https?:$/.test(url.protocol)) throw new Error();
    } catch {
      toast('Enter a full starting URL, e.g. https://example.com/blog');
      return;
    }
    const maxPages = Math.min(Math.max(Number(form.maxPages) || 200, 1), 500);
    setBusy('source');
    let id: string;
    try {
      id = await saveSource({
        id: form.id || undefined,
        type: 'crawl',
        title: form.title.trim(),
        source_url: url.href,
        metadata: { max_pages: maxPages, scope: form.scope },
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save crawl');
      return;
    } finally {
      setBusy('');
    }
    await crawl(id);
  };

  const handleFileUpload = async (file: File, kind: 'pdf' | 'image') => {
    setBusy('upload');
    try {
      const folder = kind === 'pdf' ? 'chatbot/pdfs' : 'chatbot/images';
      const url = await uploadMedia(file, folder);
      if (kind === 'pdf') {
        const pathMatch = url.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
        setForm((f) => ({
          ...f,
          type: 'pdf',
          storage_path: pathMatch ? decodeURIComponent(pathMatch[1]) : f.storage_path,
          source_url: url,
        }));
      } else {
        setForm((f) => ({ ...f, type: 'image', source_url: url }));
      }
      toast('File uploaded');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy('');
    }
  };

  const editSource = (source: KnowledgeSource) => {
    setForm({
      id: source.id,
      type: source.type === 'cms_sync' ? 'text' : source.type,
      title: source.title,
      source_url: source.source_url,
      storage_path: source.storage_path,
      body_text: source.body_text,
      imageDescription: source.type === 'image' ? source.body_text : String(source.metadata?.description ?? ''),
      maxPages: String(source.metadata?.max_pages ?? 200),
      scope: source.metadata?.scope === 'site' ? 'site' : 'section',
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      <PageMeta title="Knowledge / Chatbot" />
      <h1 className={styles.pageTitle}>Knowledge & Chatbot</h1>
      <p className={styles.pageSub}>
        Add websites to crawl, PDFs, single pages, text, and image descriptions for the site assistant. Re-index
        after changes. Keep this tab open while a crawl runs; if you leave, press Resume later.
      </p>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Chatbot settings</legend>
        {settingsForm && (
          <form onSubmit={handleSettingsSave}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={settingsForm.enabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, enabled: e.target.checked })}
              />
              Show chat widget on public site
            </label>
            <div className={styles.field}>
              <label className={styles.label}>Welcome message</label>
              <textarea
                className={styles.textarea}
                rows={2}
                value={settingsForm.welcome_message}
                onChange={(e) => setSettingsForm({ ...settingsForm, welcome_message: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>HubSpot meeting URL (Mischelle)</label>
              <input
                className={styles.input}
                value={settingsForm.hubspot_meeting_url}
                onChange={(e) => setSettingsForm({ ...settingsForm, hubspot_meeting_url: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.input}
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Extra instructions (optional)</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={settingsForm.system_prompt_append}
                onChange={(e) => setSettingsForm({ ...settingsForm, system_prompt_append: e.target.value })}
              />
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={busy === 'settings'}>
              Save settings
            </button>
          </form>
        )}
      </fieldset>

      <div className={styles.toolbar} style={{ marginTop: 24 }}>
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={!!busy || !!activeCrawl}
          onClick={async () => {
            setBusy('sync');
            try {
              await syncWebsiteContent();
              toast('Website content synced to knowledge base');
            } catch (err) {
              toast(err instanceof Error ? err.message : 'Sync failed');
            } finally {
              setBusy('');
            }
          }}
        >
          Sync website content to knowledge base
        </button>
        <button type="button" className={styles.btn} onClick={() => loadLogs()}>
          Load recent conversations
        </button>
      </div>

      {loading ? (
        <p>Loading sources…</p>
      ) : (
        <table className={styles.table} style={{ marginTop: 24 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 && (
              <tr>
                <td colSpan={4}>No sources yet. Add one below or sync website content.</td>
              </tr>
            )}
            {sources.map((s) => {
              const isCrawl = s.type === 'crawl';
              const pages = pagesByCrawl.get(s.id) ?? [];
              const live = activeCrawl?.sourceId === s.id ? activeCrawl : null;
              const running = !!live;
              const progress = live?.progress ?? countPages(pages);
              const checked = progress.indexed + progress.error;
              const expanded = expandedCrawl === s.id;
              return (
                <Fragment key={s.id}>
                  <tr>
                    <td>
                      {s.title}
                      {isCrawl && (
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4, wordBreak: 'break-all' }}>
                          {s.source_url}
                        </div>
                      )}
                    </td>
                    <td>{TYPE_LABELS[s.type]}</td>
                    <td>
                      {isCrawl && (running || s.status === 'indexing' || pages.length > 0) ? (
                        <>
                          {live
                            ? live.stopping
                              ? 'Stopping…'
                              : live.progress
                                ? 'Crawling…'
                                : 'Finding pages…'
                            : s.status === 'indexing'
                              ? 'Paused'
                              : s.status}
                          <progress
                            max={Math.max(progress.total, 1)}
                            value={checked}
                            style={{ display: 'block', width: '100%', marginTop: 6 }}
                          />
                          <div style={{ fontSize: 12, marginTop: 4 }}>{crawlSummary(progress)}</div>
                        </>
                      ) : (
                        <>
                          {s.status}
                          {s.error_message ? ` — ${s.error_message}` : ''}
                        </>
                      )}
                    </td>
                    <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={styles.btn}
                        disabled={running}
                        onClick={() => editSource(s)}
                      >
                        Edit
                      </button>
                      {isCrawl ? (
                        <>
                          {live ? (
                            <button
                              type="button"
                              className={styles.btn}
                              disabled={live.stopping}
                              onClick={stopCrawl}
                            >
                              Stop
                            </button>
                          ) : (
                            <>
                              {s.status === 'indexing' && (
                                <button
                                  type="button"
                                  className={styles.btn}
                                  disabled={!!activeCrawl || !!busy}
                                  onClick={() => void crawl(s.id, true)}
                                >
                                  Resume
                                </button>
                              )}
                              <button
                                type="button"
                                className={styles.btn}
                                disabled={!!activeCrawl || !!busy}
                                onClick={() => {
                                  if (pages.length && !confirm('Re-crawl from scratch? Pages are re-read and re-learned.'))
                                    return;
                                  void crawl(s.id);
                                }}
                              >
                                {pages.length ? 'Re-crawl' : 'Crawl'}
                              </button>
                            </>
                          )}
                          {pages.length > 0 && (
                            <button
                              type="button"
                              className={styles.btn}
                              aria-expanded={expanded}
                              onClick={() => setExpandedCrawl(expanded ? '' : s.id)}
                            >
                              {expanded ? 'Hide pages' : `Pages (${pages.length})`}
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          className={styles.btn}
                          disabled={!!busy}
                          onClick={async () => {
                            setBusy(s.id);
                            try {
                              await indexSource(s.id);
                              toast('Re-indexed');
                            } catch (err) {
                              toast(err instanceof Error ? err.message : 'Re-index failed');
                            } finally {
                              setBusy('');
                            }
                          }}
                        >
                          Re-index
                        </button>
                      )}
                      {s.type !== 'cms_sync' && (
                        <button
                          type="button"
                          className={styles.btn}
                          disabled={running}
                          onClick={async () => {
                            const what = isCrawl ? 'this crawl and everything it learned' : 'this source';
                            if (!confirm(`Delete ${what}?`)) return;
                            await deleteSource(s.id);
                            toast('Deleted');
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                  {isCrawl && expanded && pages.length > 0 && (
                    <tr>
                      <td colSpan={4}>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 320, overflowY: 'auto' }}>
                          {pages.map((p) => (
                            <li key={p.id} style={{ fontSize: 12, padding: '4px 0' }}>
                              <strong style={{ textTransform: 'capitalize' }}>{p.status}</strong>
                              {' · '}
                              <a href={p.source_url} target="_blank" rel="noreferrer">
                                {p.title && p.title !== new URL(p.source_url).pathname ? p.title : p.source_url}
                              </a>
                              {p.error_message ? ` — ${p.error_message}` : ''}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      <fieldset className={styles.fieldset} style={{ marginTop: 32 }}>
        <legend className={styles.legend}>{form.id ? 'Edit source' : 'Add knowledge source'}</legend>
        <form onSubmit={handleSourceSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select
              className={styles.input}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as KnowledgeSourceType })}
            >
              <option value="text">Text snippet</option>
              <option value="crawl">Website or blog (read every linked page)</option>
              <option value="url">Single web page URL</option>
              <option value="pdf">PDF</option>
              <option value="image">Image + description</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          {form.type === 'url' && (
            <div className={styles.field}>
              <label className={styles.label}>URL</label>
              <input
                className={styles.input}
                value={form.source_url}
                onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          )}
          {form.type === 'crawl' && (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="crawl-url">
                  Starting URL
                </label>
                <input
                  id="crawl-url"
                  className={styles.input}
                  type="url"
                  value={form.source_url}
                  onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                  placeholder="https://www.example.com/blog"
                  required
                />
                <p style={{ fontSize: 12, opacity: 0.75, margin: '6px 0 0' }}>
                  The assistant reads this page, the site&apos;s sitemap, and every internal link it finds, then learns
                  each page. Articles on this website&apos;s own blog are already covered by &ldquo;Sync website
                  content&rdquo;.
                </p>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="crawl-scope">
                  How far to go
                </label>
                <select
                  id="crawl-scope"
                  className={styles.input}
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value as 'section' | 'site' })}
                >
                  <option value="section">This section, plus the pages it links to (best for a blog)</option>
                  <option value="site">The whole website</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="crawl-max">
                  Maximum pages (1–500)
                </label>
                <input
                  id="crawl-max"
                  className={styles.input}
                  type="number"
                  min={1}
                  max={500}
                  value={form.maxPages}
                  onChange={(e) => setForm({ ...form, maxPages: e.target.value })}
                />
              </div>
            </>
          )}
          {form.type === 'pdf' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Upload PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFileUpload(file, 'pdf');
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Storage path (auto-filled after upload)</label>
                <input className={styles.input} value={form.storage_path} readOnly />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Optional notes if PDF text extraction fails</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={form.body_text}
                  onChange={(e) => setForm({ ...form, body_text: e.target.value })}
                />
              </div>
            </>
          )}
          {form.type === 'image' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Upload image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !isVideoUrl(file.name)) void handleFileUpload(file, 'image');
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description for the assistant (required)</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={form.imageDescription}
                  onChange={(e) => setForm({ ...form, imageDescription: e.target.value })}
                  required
                />
              </div>
            </>
          )}
          {form.type === 'text' && (
            <div className={styles.field}>
              <label className={styles.label}>Content</label>
              <textarea
                className={styles.textarea}
                rows={8}
                value={form.body_text}
                onChange={(e) => setForm({ ...form, body_text: e.target.value })}
                required
              />
            </div>
          )}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary} disabled={!!busy || !!activeCrawl}>
              {form.type === 'crawl'
                ? form.id
                  ? 'Update & re-crawl'
                  : 'Add & start crawl'
                : form.id
                  ? 'Update & re-index'
                  : 'Add & index'}
            </button>
            {form.id && (
              <button type="button" className={styles.btn} onClick={() => setForm(EMPTY_FORM)}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </fieldset>

      {logs.length > 0 && (
        <fieldset className={styles.fieldset} style={{ marginTop: 24 }}>
          <legend className={styles.legend}>Recent conversations</legend>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {logs.map((log, i) => (
              <li key={i} style={{ marginBottom: 12, fontSize: 13 }}>
                <strong>{log.role}</strong> · {new Date(log.created_at).toLocaleString()}
                <div style={{ marginTop: 4 }}>{log.message}</div>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </>
  );
}
