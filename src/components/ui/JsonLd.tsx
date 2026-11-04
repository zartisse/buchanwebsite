import { Helmet } from 'react-helmet-async';

/** Structured data for Google (schema.org JSON-LD). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
