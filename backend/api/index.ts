import Fastify from 'fastify';
import cors from '@fastify/cors';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface iTunesResult {
  kind?: string;
  artistName?: string;
  releaseDate?: string;
  trackId?: number;
  trackName?: string;
  trackTimeMillis?: number;
  artworkUrl100?: string;
  previewUrl?: string;
}

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

app.get("/healthcheck", async () => {
    return { status: "ok" };
});

// Search iTunes
app.get("/api/search", async (req: any, res: any) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).send({ error: "Search term is required" });
    }

    const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=25`);
    
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

    return res.send({
      message: `Found ${results.length} results for "${term}"`,
      results: results
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).send({ error: "Failed to search iTunes" });
  }
});

// Save item
app.post("/api/save", async (req: any, res: any) => {
  try {
    const item = req.body;
    
    if (!item || !item.trackId) {
      return res.status(400).send({ error: "Valid iTunes item data is required" });
    }

    const trackId = item.trackId?.toString() || "";
    
    const existingItem = await prisma.search.findFirst({
      where: { trackId }
    });
    
    if (existingItem) {
      return res.send({
        message: `"${item.trackName || 'item'}" by ${item.artistName || 'Unknown Artist'} already saved`,
        result: existingItem
      });
    }
    
    const savedItem = await prisma.search.create({
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

    return res.send({
      message: `Saved "${item.trackName || 'item'}" by ${item.artistName || 'Unknown Artist'}`,
      result: savedItem
    });

  } catch (error) {
    console.error("Save error:", error);
    return res.status(500).send({ error: "Failed to save item" });
  }
});

// Get favorites
app.get("/api/favorites", async (req: any, res: any) => {
  try {
    const savedResults = await prisma.search.findMany({
      orderBy: { id: 'desc' }
    });

    return res.send({
      message: `Found ${savedResults.length} saved results`,
      results: savedResults
    });

  } catch (error) {
    console.error("Query error:", error);
    return res.status(500).send({ error: "Failed to query saved results" });
  }
});

// Delete item
app.delete("/api/favorites/remove/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).send({ error: "Track ID is required" });
    }

    await prisma.search.deleteMany({
      where: { trackId: id }
    });
    
    return res.send({ message: `Item with track ID ${id} deleted successfully` });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).send({ error: "Failed to delete item" });
  }
});

// Clear all
app.delete("/api/favorites/clear", async (req: any, res: any) => {
  try {
    await prisma.search.deleteMany();
    return res.send({ message: "All search results cleared successfully" });
  } catch (error) {
    console.error("Clear error:", error);
    return res.status(500).send({ error: "Failed to clear search results" });
  }
});

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
