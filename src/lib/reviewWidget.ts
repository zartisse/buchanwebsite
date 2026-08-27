/** Third-party Google reviews widget (Elfsight) embed configuration. */
export const REVIEW_WIDGET = {
  scriptSrc: 'https://elfsightcdn.com/platform.js',
  containerClassPrefix: 'elfsight-app-',
} as const;

export function reviewWidgetContainerClass(widgetId: string): string {
  return `${REVIEW_WIDGET.containerClassPrefix}${widgetId}`;
}

let scriptPromise: Promise<void> | null = null;

export function loadReviewWidgetScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${REVIEW_WIDGET.scriptSrc}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = REVIEW_WIDGET.scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load review widget script'));
    document.body.appendChild(script);
  });

  return scriptPromise;
}
