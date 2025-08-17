import axios from "axios";
import prisma from "../../utils/prisma.js";

export interface iTunesResult {
  kind?: string;
  artistName?: string;
  releaseDate?: string;
  trackId?: number;
  trackName?: string;
  trackTimeMillis?: number;
  artworkUrl100?: string;
  previewUrl?: string;
}

export async function searchItunes(term: string): Promise<iTunesResult[]> {
  const response = await axios.get(`${process.env.ITUNES_BASE_URL}/search?term=${encodeURIComponent(term)}&limit=25`);
  
  const results: iTunesResult[] = response.data.results.map((item: any) => ({
    kind: item.kind,
    artistName: item.artistName,
    releaseDate: item.releaseDate,
    trackId: item.trackId,
    trackName: item.trackName,
    trackTimeMillis: item.trackTimeMillis,
    artworkUrl100: item.artworkUrl100,
    previewUrl: item.previewUrl
  }));
  
  return results;
}

export async function saveItem(item: iTunesResult) {
  const trackId = item.trackId?.toString() || "";
  
  // Check if item already exists
  const existingItem = await prisma.search.findFirst({
    where: { trackId }
  });
  
  if (existingItem) {
    return existingItem; // Return existing item instead of creating duplicate
  }
  
  return await prisma.search.create({
    data: {
      kind: item.kind || "",
      artistName: item.artistName || "",
      releaseDate: item.releaseDate || "",
      trackId: trackId,
      trackName: item.trackName || "",
      trackTimeMillis: item.trackTimeMillis || 0,
      artworkUrl100: item.artworkUrl100 || "",
      previewUrl: item.previewUrl || ""
    }
  });
}

export async function getSavedResults() {
  return await prisma.search.findMany({
    orderBy: { id: 'desc' }
  });
}

export async function deleteSavedItem(trackId: string) {
  return await prisma.search.deleteMany({
    where: { trackId }
  });
}

export async function clearAllSearchResults() {
  return await prisma.search.deleteMany();
}
