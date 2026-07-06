import type { HeroSection } from '../../types';
import ps from '../../styles/pages.module.css';

export function HeroTitle({ hero }: { hero: HeroSection }) {
  return (
    <h1 className={ps.heroTitle}>
      {hero.title}
      {hero.title_emphasis && (
        <>
          <br /><em>{hero.title_emphasis}</em>
        </>
      )}
    </h1>
  );
}

export function LegacyTitle({ title, title_line2, title_emphasis }: { title: string; title_line2?: string; title_emphasis?: string }) {
  return (
    <h2 className={ps.sectionTitle}>
      {title}
      {title_line2 && (
        <>
          <br />{title_line2}
        </>
      )}
      {title_emphasis && (
        <>
          <br /><em>{title_emphasis}</em>
        </>
      )}
    </h2>
  );
}

export function SectionTitleWithEmphasis({ title, title_emphasis, className, style }: { title: string; title_emphasis?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={className ?? ps.sectionTitle} style={style}>
      {title}
      {title_emphasis && (
        <>
          <br /><em>{title_emphasis}</em>
        </>
      )}
    </h2>
  );
}
