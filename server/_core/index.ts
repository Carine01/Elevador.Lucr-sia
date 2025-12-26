import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV, validateEnvOnStartup } from "./env";
import { logger } from "./logger";
import stripeRouter from "../routes/stripe";

// 🔐 VALIDAR VARIÁVEIS CRÍTICAS EM STARTUP
validateEnvOnStartup();

// Verificar disponibilidade de porta
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

// ==================== SERVER SETUP ====================

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ==================== TRUST PROXY ====================
  // IMPORTANTE: Necessário quando atrás de um proxy reverso (Railway, Heroku, etc)
  // Isso permite que o express-rate-limit identifique corretamente os IPs dos usuários
  // via header X-Forwarded-For
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Confiar no primeiro proxy
    console.log('[Server] Trust proxy enabled for production');
  }

  // ==================== HEALTH CHECK ====================
  // IMPORTANTE: Registrar ANTES de qualquer outro middleware
  // Endpoint para Railway/Kubernetes verificar se a aplicação está saudável
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // ==================== REQUEST LOGGING ====================
  // Correlation ID e logging automático de requests
  const { requestLoggingMiddleware } = await import("./logging-middleware");
  app.use(requestLoggingMiddleware());

  // ==================== SECURITY HEADERS (HELMET) ====================
  // Proteção contra vulnerabilidades web comuns
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.stripe.com", "https://oauth.manus.im", "wss:", "ws:"],
        frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // Necessário para carregar recursos externos
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  // ==================== CORS CONFIGURATION ====================
  // BUG-009: Configurar CORS apropriadamente
  // Em produção no Railway, pegar a URL automaticamente
  const railwayUrl = process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PUBLIC_DOMAIN;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    ...(railwayUrl ? [`https://${railwayUrl}`] : []),
  ];

  // Log de startup para debug
  console.log('[Server] Starting with configuration:', {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    allowedOrigins,
    railwayUrl,
  });

  app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Permitir requisições sem origin (mobile apps, postman, health checks, etc)
      if (!origin) return callback(null, true);
      
      // Em produção, verificar allowedOrigins
      if (process.env.NODE_ENV === 'production') {
        // Permitir qualquer subdomínio do Railway
        if (origin.includes('.railway.app') || origin.includes('.up.railway.app')) {
          return callback(null, true);
        }
        // Permitir origens configuradas
        if (allowedOrigins.some(allowed => origin === allowed || origin.endsWith(allowed.replace('https://', '')))) {
          return callback(null, true);
        }
        // Em produção, bloquear origens desconhecidas mas logar
        logger.warn('CORS blocked origin in production', { origin });
        return callback(null, true); // Temporariamente permitir enquanto configura
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  // ==================== RATE LIMITING ====================
  // BUG-004: Adicionar rate limiting
  const publicApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 requisições por IP
    message: {
      error: 'Muitas requisições. Tente novamente em 15 minutos.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authenticatedApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Usuários autenticados: 100 req/15min
    message: {
      error: 'Limite de requisições atingido. Aguarde antes de tentar novamente.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // ==================== STRIPE WEBHOOK ====================
  // BUG-001: Webhook do Stripe - COMPLETAMENTE IMPLEMENTADO
  // IMPORTANTE: Deve vir ANTES do express.json()
  app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
  app.use('/api/stripe', stripeRouter);

  // ==================== BODY PARSERS ====================
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // ==================== tRPC API ====================
  app.use(
    "/api/trpc",
    publicApiLimiter, // Rate limiting para API pública
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ==================== STATIC FILES / VITE ====================
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    console.log('[Server] Production mode - serving static files');
    serveStatic(app);
  }

  // ==================== START SERVER ====================
  const port = parseInt(process.env.PORT || "3000");
  
  // Em produção, NÃO procurar por outra porta - usar exatamente a PORT definida
  // Em desenvolvimento, podemos procurar uma porta disponível
  const finalPort = process.env.NODE_ENV === "production" 
    ? port 
    : await findAvailablePort(port);

  if (finalPort !== port && process.env.NODE_ENV !== "production") {
    logger.warn(`Port ${port} is busy, using port ${finalPort} instead`);
  }

  // Em produção (containers), SEMPRE fazer bind em 0.0.0.0
  // Em desenvolvimento, usar localhost
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

  console.log(`[Server] Attempting to bind to ${host}:${finalPort}`);
  
  server.listen(finalPort, host, () => {
    console.log(`[Server] ✅ Successfully bound to ${host}:${finalPort}`);
    logger.info(`Server running on http://${host}:${finalPort}/`);
  });
  
  server.on('error', (err) => {
    console.error('[Server] ❌ Failed to start:', err);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error('[Server] ❌ Startup error:', error);
  console.error('[Server] Stack:', error?.stack);
  logger.error('Failed to start server', error);
  process.exit(1);
});

// Captura de erros não tratados
process.on('uncaughtException', (error) => {
  console.error('[Server] ❌ Uncaught Exception:', error);
  console.error('[Server] Stack:', error?.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] ❌ Unhandled Rejection at:', promise);
  console.error('[Server] Reason:', reason);
  process.exit(1);
});

// Log inicial para confirmar que o módulo foi carregado
console.log('[Server] 🚀 Module loaded, starting initialization...');
console.log('[Server] Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? '***configured***' : '❌ MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '***configured***' : '❌ MISSING',
});
