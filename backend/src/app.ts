import Fastify from 'fastify';
import searchRoutes from './modules/search/search.route.js';

const app = Fastify();

app.register(import('@fastify/cors'), {
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});


app.get("/healthcheck", async () => {
    return { status: "ok" };
});

async function main() {
    app.register(searchRoutes, { prefix: "/api" });
    try {
        app.listen({ port: 3000 }).then(() => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error(error);
    }
}

main();
