import { useState } from 'react';
import type { HomePageContent, ServiceIconName } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { ServiceIcon } from '../../ui/ServiceIcon';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './QualityLayersInteractive.module.css';

type QualityLayersInteractiveProps = {
  section: HomePageContent['quality_layers'];
};

function layerIcon(layer: { icon?: ServiceIconName; id: string }): ServiceIconName {
  if (layer.icon) return layer.icon;
  if (layer.id.includes('water')) return 'water';
  if (layer.id.includes('struct')) return 'structure';
  if (layer.id.includes('comfort')) return 'comfort';
  return 'craft';
}

function CalloutButton({
  layer,
  activeId,
  onSelect,
}: {
  layer: HomePageContent['quality_layers']['layers'][0];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.callout} ${activeId === layer.id ? styles.calloutActive : ''}`}
      onClick={() => onSelect(layer.id)}
    >
      <ServiceIcon name={layerIcon(layer)} className={styles.calloutIcon} size={24} />
      <div className={styles.calloutText}>
        <strong>{layer.label}</strong>
        <p>{layer.benefit}</p>
      </div>
    </button>
  );
}

export function QualityLayersInteractive({ section }: QualityLayersInteractiveProps) {
  const [activeId, setActiveId] = useState<string | null>(section.layers[0]?.id ?? null);
  const active = section.layers.find((l) => l.id === activeId) ?? section.layers[0];
  const leftLayers = section.layers.slice(0, 2);
  const rightLayers = section.layers.slice(2);

  const title = section.title_emphasis
    ? <>{section.title} <em>{section.title_emphasis}</em></>
    : section.title;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="down">
          <div className={styles.header}>
            {section.eyebrow && <span className="eyebrowRule eyebrowRuleCenter">{section.eyebrow}</span>}
            <h2 className={styles.title}>{title}</h2>
            {section.body && <p className={styles.body}>{section.body}</p>}
          </div>
        </RevealOnScroll>

        <div className={styles.interactiveWrap}>
          <div className={styles.calloutsLeft}>
            {leftLayers.map((layer, i) => (
              <RevealOnScroll key={layer.id} index={i} variant="left">
                <CalloutButton layer={layer} activeId={activeId} onSelect={setActiveId} />
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll variant="scale">
            <div className={styles.elevationPanel}>
              <OptimizedImage src={section.elevation_image_url} seed="quality-layers" className={styles.elevationPhoto} direct />
              {section.layers.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  className={`${styles.hotspot} ${activeId === layer.id ? styles.hotspotActive : ''}`}
                  style={{ left: `${layer.x}%`, top: `${layer.y}%` }}
                  onClick={() => setActiveId(layer.id)}
                  aria-expanded={activeId === layer.id}
                  aria-label={layer.label}
                >
                  <span className={styles.hotspotRing} aria-hidden />
                  <span className={styles.hotspotDot} aria-hidden />
                </button>
              ))}
            </div>
          </RevealOnScroll>

          <div className={styles.calloutsRight}>
            {rightLayers.map((layer, i) => (
              <RevealOnScroll key={layer.id} index={i} variant="right">
                <CalloutButton layer={layer} activeId={activeId} onSelect={setActiveId} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {active && (
          <div className={styles.mobileDetail} aria-live="polite">
            <ServiceIcon name={layerIcon(active)} className={styles.calloutIcon} size={24} />
            <div>
              <strong>{active.label}</strong>
              <p>{active.benefit}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
