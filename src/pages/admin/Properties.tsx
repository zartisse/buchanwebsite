import { useState } from 'react';
import { useProperties } from '../../hooks/useProperties';
import { PropertyEditor } from '../../components/admin/PropertyEditor';
import { StatusPill } from '../../components/ui/StatusPill';
import { PageMeta } from '../../components/ui/PageMeta';
import { toast } from '../../components/ui/Toast';
import type { Property } from '../../types';
import styles from '../../styles/admin.module.css';

export function AdminProperties() {
  const { properties, loading, error, saveProperty, deleteProperty } = useProperties({ admin: true });
  const [editing, setEditing] = useState<Property | null | 'new'>(null);

  const existingSlugs = properties
    .filter((p) => (editing !== null && editing !== 'new' ? p.id !== editing.id : true))
    .map((p) => p.slug);

  if (editing !== null) {
    return (
      <PropertyEditor
        property={editing === 'new' ? undefined : editing}
        existingSlugs={existingSlugs}
        onSave={async (data) => {
          try {
            await saveProperty(data);
            toast('Saved ✓');
            setEditing(null);
          } catch (e) {
            toast(e instanceof Error ? e.message : 'Failed to save property');
          }
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <>
      <PageMeta title="Properties" />
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.pageTitle}>Properties</h1>
          <p className={styles.pageSub}>Manage portfolio homes and listings.</p>
        </div>
        <button type="button" className={styles.btnPrimary} onClick={() => setEditing('new')}>New Property</button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Status</th>
              <th>Specs</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.city}</td>
                <td><StatusPill status={p.status} /></td>
                <td>{[p.beds && `${p.beds} bd`, p.baths && `${p.baths} ba`, p.sqft && `${p.sqft} sf`].filter(Boolean).join(' · ')}</td>
                <td>{p.featured ? `#${p.featured_order ?? 0}` : '—'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className={styles.btn} onClick={() => setEditing(p)}>Edit</button>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={async () => {
                      if (!window.confirm(`Delete "${p.name}"?`)) return;
                      try {
                        await deleteProperty(p.id);
                        toast('Property deleted');
                      } catch (e) {
                        toast(e instanceof Error ? e.message : 'Failed to delete property');
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
