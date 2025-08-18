import Fastify from 'fastify';
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

// Simple test route
app.get("/api/test", async () => {
    return { message: "Backend is working!" };
});

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
