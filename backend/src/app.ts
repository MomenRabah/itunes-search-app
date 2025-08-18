import Fastify from 'fastify';
import searchRoutes from './modules/search/search.route.js';
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

// Register search routes with /api prefix
app.register(searchRoutes, { prefix: "/api" });

// For Vercel deployment
export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}

// For local development
async function main() {
    try {
        app.listen({ port: 3000 }).then(() => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error(error);
    }
}