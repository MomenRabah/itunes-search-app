import Fastify from 'fastify';
import searchRoutes from '../src/modules/search/search.route.js';
import cors from '@fastify/cors';

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

app.register(searchRoutes, { prefix: "/api" });

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
