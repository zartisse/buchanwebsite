import { useState } from 'react';
import type { HomePageContent, ServiceIconName } from '../../../types';
import { assetUrl } from '../../../lib/assets';
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

export function QualityLayersInteractive({ section }: QualityLayersInteractiveProps) {
  const [activeId, setActiveId] = useState<string | null>(section.layers[0]?.id ?? null);
  const active = section.layers.find((l) => l.id === activeId) ?? section.layers[0];

  const title = section.title_emphasis
    ? <>{section.title} <em>{section.title_emphasis}</em></>
    : section.title;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <div className={styles.header}>
            <span className="eyebrowRule eyebrowRuleCenter">{section.eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
          </div>
        </RevealOnScroll>

        <div className={styles.interactiveWrap}>
          <RevealOnScroll>
            <div className={styles.elevationPanel}>
              <img src={assetUrl(section.elevation_image_url)} alt="" className={styles.elevationPhoto} />
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

          <div className={styles.callouts}>
            {section.layers.map((layer, i) => (
              <RevealOnScroll key={layer.id} index={i}>
                <button
                  type="button"
                  className={`${styles.callout} ${activeId === layer.id ? styles.calloutActive : ''}`}
                  onClick={() => setActiveId(layer.id)}
                >
                  <ServiceIcon name={layerIcon(layer)} className={styles.calloutIcon} size={24} />
                  <div className={styles.calloutText}>
                    <strong>{layer.label}</strong>
                    <p>{layer.benefit}</p>
                  </div>
                </button>
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
