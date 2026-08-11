import { useParams, useNavigate } from 'react-router-dom';
import { useHubPages, useHubPage } from '../../hooks/useHubPage';
import { HubPageEditor } from '../../components/admin/HubPageEditor';
import { mergeHubContent } from '../../data/hubContentDefaults';
import { getDemoHubPage } from '../../data/hubContentDefaults';
import { HUB_PAGE_SLUGS, type HubPageSlug } from '../../types';
import { toast } from '../../components/ui/Toast';

export function AdminHubPageEdit() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { saveHubPage } = useHubPages();
  const pageSlug = slug as HubPageSlug;

  if (!HUB_PAGE_SLUGS.includes(pageSlug)) {
    return <p>Unknown hub page slug.</p>;
  }

  const { page, loading } = useHubPage(pageSlug);
  const demo = getDemoHubPage(pageSlug);
  const initial = page ?? demo;
  const mergedContent = mergeHubContent(initial.content, pageSlug);

  if (loading) return <p>Loading…</p>;

  return (
    <HubPageEditor
      slug={pageSlug}
      page={{ ...initial, content: mergedContent }}
      onSave={async (data) => {
        try {
          await saveHubPage(data);
          toast('Saved ✓');
          navigate('/admin/hub-pages');
        } catch (e) {
          toast(e instanceof Error ? e.message : 'Failed to save hub page');
        }
      }}
      onCancel={() => navigate('/admin/hub-pages')}
    />
  );
}
