import Fastify from 'fastify';
import searchRoutes from '../src/modules/search/search.route.js';
import cors from '@fastify/cors';

let app: any = null;

async function createApp() {
  if (app) return app;
  
  app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  app.get("/healthcheck", async () => {
    return { status: "ok" };
  });

  await app.register(searchRoutes, { prefix: "/api" });
  
  return app;
}

export default async function handler(req: any, res: any) {
  const fastify = await createApp();
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
