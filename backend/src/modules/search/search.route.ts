import type { FastifyInstance } from "fastify";
import { searchHandler, saveItemHandler, getSavedResultsHandler, deleteItemHandler, clearAllHandler } from "./search.controller.js";

async function searchRoutes(app: FastifyInstance) {
    app.get("/search", searchHandler);
    app.post("/save", saveItemHandler);
    app.get("/favorites", getSavedResultsHandler);
    app.delete("/favorites/remove/:id", deleteItemHandler);
    app.delete("/favorites/clear", clearAllHandler);
}

export default searchRoutes;

