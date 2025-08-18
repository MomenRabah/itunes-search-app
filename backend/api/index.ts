import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import searchRoutes from "../src/modules/search/search.route.js";

let app: FastifyInstance;

async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: false });

  await fastify.register(cors, {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  fastify.get("/healthcheck", async () => {
    return { status: "ok" };
  });

  await fastify.register(searchRoutes, { prefix: "/api" });

  return fastify;
}

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await buildApp();
    await app.ready();
  }
  app.server.emit("request", req, res);
}
