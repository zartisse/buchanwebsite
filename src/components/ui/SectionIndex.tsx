/** Editorial section label: "02 — What we build" (see DESIGN.md). */
export function SectionIndex({
  index,
  label,
  onDark = false,
  className = '',
}: {
  index?: string;
  label?: string;
  onDark?: boolean;
  className?: string;
}) {
  if (!index && !label) return null;
  return (
    <p className={`sectionIndex ${onDark ? 'sectionIndexOnDark' : ''} ${className}`}>
      {index && <b>{index}</b>}
      {label && <span>{label}</span>}
    </p>
  );
}
