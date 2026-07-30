export function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1).split('/')[0] || null;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const embed = u.pathname.match(/\/embed\/([^/?]+)/);
      if (embed) return embed[1];
    }
  } catch {
    return null;
  }
  return null;
}

export function youTubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    showinfo: '0',
    iv_load_policy: '3',
    disablekb: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeId(url) !== null;
}
