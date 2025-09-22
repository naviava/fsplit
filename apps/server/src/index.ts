import { createServer } from "http";
import express from "express";
import cors from "cors";

import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { SocketService } from "./services/socket";
import Env from "./lib/env";
import { createContext } from "./config/trpc.config";
import { initListeners } from "./services/redis-sub";

const PORT = Env.PORT || 5000;

const app = express();
const server = createServer(app);
export const socket = new SocketService(server);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Express server");
});

// tRPC Routes.
app.use(
  "/api",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

async function startServer() {
  // Start the Redis subscriber.
  const { unsubscribe } = await initListeners();

  // Start the HTTP Server.
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return { unsubscribe };
}
const { unsubscribe } = await startServer();

// Graceful shutdown for SIGINT
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");

  try {
    // Close WebSocket service.
    await socket.close();

    // Cleanup Redis subscriber.
    unsubscribe();

    // Close HTTP server.
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log("HTTP server closed.");

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

// Graceful shutdown for SIGTERM
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  try {
    await socket.close();
    unsubscribe();
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log("HTTP server closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});
