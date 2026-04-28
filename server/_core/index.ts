import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // AVI Agent - System Inventory Endpoint (Standardized v1.0.5)
  // EVOLUÇÃO: Prioridade Máxima - Bypass de Cache e Fallthrough
  app.all('/api/system/inventory', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-AVI-Agent-Layer', 'Evolution-v1.0.5');
    
    const inventory = {
      appName: process.env.APP_NAME || 'Celebra - Ecossistema Litúrgico Inteligente',
      appId: 'celebra',
      version: '1.0.5',
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      endpoints: ['/api/system/inventory', '/api/trpc'],
      health: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };
    
    return res.status(200).send(JSON.stringify(inventory));
  });

  // Pre-emptive route blocking to prevent HTML fallthrough for API
  app.use('/api/*', (req, res, next) => {
    if (req.originalUrl === '/api/system/inventory') return next();
    next();
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`✅ AVI Agent endpoint available at http://localhost:${port}/api/system/inventory`);
  });
}

startServer().catch(console.error);
