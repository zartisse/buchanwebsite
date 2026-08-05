import { useState } from 'react';
import { QUALITY_LAYERS } from '../../../data/iaContent';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './QualityLayersInteractive.module.css';

const ELEVATION_IMAGE = '/assets/quality-layers-house.jpg';

export function QualityLayersInteractive() {
  const [activeId, setActiveId] = useState<string | null>(QUALITY_LAYERS[0]?.id ?? null);
  const active = QUALITY_LAYERS.find((l) => l.id === activeId) ?? QUALITY_LAYERS[0];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>Quality in Every Layer</span>
          <h2 className={styles.title}>Built for how<br /><em>you live.</em></h2>
        </RevealOnScroll>

        <div className={styles.interactiveWrap}>
          <div className={styles.elevationPanel}>
            <img src={ELEVATION_IMAGE} alt="" className={styles.elevationPhoto} />
            <div className={styles.elevationGradient} aria-hidden />
            {QUALITY_LAYERS.map((layer) => (
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
              {QUALITY_LAYERS.map((layer) => (
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
