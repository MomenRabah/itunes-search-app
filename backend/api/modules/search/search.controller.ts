import type { FastifyReply, FastifyRequest } from "fastify";
import { searchItunes, saveItem, getSavedResults, deleteSavedItem, clearAllSearchResults } from "./search.service.js";
import type { iTunesResult } from "./search.service.js";

interface SearchQuery {
  term: string;
}

interface QueryParams {
  search?: string;
}

interface DeleteParams {
  id: string;
}

export async function searchHandler(req: FastifyRequest<{ Querystring: SearchQuery }>, res: FastifyReply) {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).send({ error: "Search term is required" });
    }

    const searchResults: iTunesResult[] = await searchItunes(term);

    return res.send({
      message: `Found ${searchResults.length} results for "${term}"`,
      results: searchResults
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).send({ error: "Failed to search iTunes" });
  }
}

export async function saveItemHandler(req: FastifyRequest<{ Body: iTunesResult }>, res: FastifyReply) {
  try {
    const item = req.body;
    
    if (!item || !item.trackId) {
      return res.status(400).send({ error: "Valid iTunes item data is required" });
    }

    const savedItem = await saveItem(item);

    return res.send({
      message: `Saved "${item.trackName || 'item'}" by ${item.artistName || 'Unknown Artist'}`,
      result: savedItem
    });

  } catch (error) {
    console.error("Save error:", error);
    return res.status(500).send({ error: "Failed to save item" });
  }
}

export async function getSavedResultsHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    const savedResults = await getSavedResults();

    return res.send({
      message: `Found ${savedResults.length} saved results`,
      results: savedResults
    });

  } catch (error) {
    console.error("Query error:", error);
    return res.status(500).send({ error: "Failed to query saved results" });
  }
}

export async function deleteItemHandler(req: FastifyRequest<{ Params: DeleteParams }>, res: FastifyReply) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).send({ error: "Track ID is required" });
    }

    await deleteSavedItem(id);
    
    return res.send({ message: `Item with track ID ${id} deleted successfully` });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).send({ error: "Failed to delete item" });
  }
}

export async function clearAllHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    await clearAllSearchResults();
    return res.send({ message: "All search results cleared successfully" });
  } catch (error) {
    console.error("Clear error:", error);
    return res.status(500).send({ error: "Failed to clear search results" });
  }
}

    
