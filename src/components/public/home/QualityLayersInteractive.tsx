import { useState } from 'react';
import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './QualityLayersInteractive.module.css';

type QualityLayersInteractiveProps = {
  section: HomePageContent['quality_layers'];
};

export function QualityLayersInteractive({ section }: QualityLayersInteractiveProps) {
  const [activeId, setActiveId] = useState<string | null>(section.layers[0]?.id ?? null);
  const active = section.layers.find((l) => l.id === activeId) ?? section.layers[0];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>{section.eyebrow}</span>
          <h2 className={styles.title}>
            {section.title}
            {section.title_emphasis && (
              <>
                <br /><em>{section.title_emphasis}</em>
              </>
            )}
          </h2>
        </RevealOnScroll>

        <div className={styles.interactiveWrap}>
          <div className={styles.elevationPanel}>
            <img src={section.elevation_image_url} alt="" className={styles.elevationPhoto} />
            <div className={styles.elevationGradient} aria-hidden />
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
                <span className={styles.hotspotPulse} aria-hidden />
                <span className={styles.hotspotDot} aria-hidden />
              </button>
            ))}
          </div>

          <div className={styles.calloutPanel}>
            {active && (
              <>
                <h3>{active.label}</h3>
                <p>{active.benefit}</p>
              </>
            )}
            <ul className={styles.layerList}>
              {section.layers.map((layer) => (
                <li key={layer.id}>
                  <button
                    type="button"
                    className={activeId === layer.id ? styles.layerBtnActive : styles.layerBtn}
                    onClick={() => setActiveId(layer.id)}
                  >
                    {layer.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
