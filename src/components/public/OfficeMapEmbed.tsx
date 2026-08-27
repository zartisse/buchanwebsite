import { OFFICE_MAP_EMBED_URL, OFFICE_MAPS_LINK_URL } from '../../data/contactInfo';
import styles from './OfficeMapEmbed.module.css';

type OfficeMapEmbedProps = {
  embedUrl?: string;
  mapsLinkUrl?: string;
};

export function OfficeMapEmbed({
  embedUrl = OFFICE_MAP_EMBED_URL,
  mapsLinkUrl = OFFICE_MAPS_LINK_URL,
}: OfficeMapEmbedProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <iframe
          src={embedUrl}
          title="John Buchan Homes office location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a href={mapsLinkUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Open in Google Maps <span aria-hidden>→</span>
      </a>
    </div>
  );
}
