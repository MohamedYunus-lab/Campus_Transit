import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import authRoutes from './routes/auth.js';
import routeRoutes from './routes/routes.js';
import busRoutes from './routes/buses.js';
import driverRoutes from './routes/drivers.js';
import boardingPointRoutes from './routes/boardingPoints.js';
import scheduleRoutes from './routes/schedules.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Performance: Enable caching
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 min cache

// Performance: Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased to 2000 to easily handle hundreds of concurrent students on campus Wi-Fi
  message: 'Too many requests, please try again later'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit to 20 login attempts per 15 min
  message: 'Too many login attempts, please try again later'
});

// Trust proxy is required if deploying behind a reverse proxy (Render, Heroku, Nginx, etc.)
// This ensures rate limiting uses the student's actual IP, not the load balancer's IP
app.set('trust proxy', 1);

// Middleware
app.use(compression()); // Compress responses
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(generalLimiter); // Apply rate limiting to all routes

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Cache middleware for GET requests
const cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    // Invalidate cache on mutations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      cache.flushAll();
    }
    return next();
  }

  // Do not cache authentication routes
  if (req.originalUrl.includes('/auth/')) {
    return next();
  }
  
  const key = req.originalUrl;
  const cachedData = cache.get(key);
  
  if (cachedData) {
    res.set('X-Cache', 'HIT');
    return res.json(cachedData);
  }
  
  // Capture original res.json
  const originalJson = res.json.bind(res);
  
  res.json = (data) => {
    cache.set(key, data);
    res.set('X-Cache', 'MISS');
    return originalJson(data);
  };
  
  next();
};

app.use('/api/', cacheMiddleware);

// Routes
app.use('/api/auth/login', loginLimiter); // Stricter limiting for login
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/boarding-points', boardingPointRoutes);
app.use('/api/schedules', scheduleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'College Bus API is running',
    timestamp: new Date().toISOString(),
    cacheSize: cache.keys().length 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚌 Server running on http://localhost:${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`⚡ Performance features enabled:`)
  console.log(`   - Response compression`);
  console.log(`   - Rate limiting`);
  console.log(`   - Response caching (10 min)`);
});
