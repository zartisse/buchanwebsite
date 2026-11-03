// Google Tag Manager helpers. The GTM container is loaded in index.html.
// In GTM, use Custom Event triggers on these event names:
//   virtual_page_view  every route change in this single-page app (GA4 page_view)
//   generate_lead      a website form was saved successfully (Google Ads / GA4 conversion)

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushEvent(evt: DataLayerEvent) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(evt);
}

export function trackPageView(path: string) {
  pushEvent({
    event: 'virtual_page_view',
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackLead(details: { form: string; topic?: string; property?: string }) {
  pushEvent({
    event: 'generate_lead',
    form_name: details.form,
    lead_topic: details.topic ?? '',
    property_name: details.property ?? '',
  });
}
