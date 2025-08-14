import { getLiveDashboard } from "../controllers/statsController.js";

export async function statsRoutes(fastify) {
    fastify.get('/live', {
        websocket: true,
        handler: getLiveDashboard
    });
}