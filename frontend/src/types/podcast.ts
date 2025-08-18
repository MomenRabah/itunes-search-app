export interface Podcast {
  id: number;
  kind: string;
  artistName: string;
  releaseDate: string;
  trackId: string;
  trackName: string;
  trackTimeMillis: number;
  artworkUrl100: string;
  previewUrl: string;
}

export function formatTrackTime(milliseconds: number): string {
    if (!milliseconds) return "00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}