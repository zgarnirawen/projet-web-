import express from "express";
import cors from "cors";
import articleRoutes from "./routes/article.route";
import commandeRoutes from "./routes/commande.route";
import authRoutes from "./routes/auth.route";
import livreurRoutes from "./routes/livreur.route";
import { connectDB } from "./dal/database";

const app = express();

// Connexion à MongoDB
connectDB();

// CORS - DOIT être avant les routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'ERP Backend API',
    version: '1.0.0',
    endpoints: {
      test: '/test',
      articles: '/api/articles',
      commandes: '/api/commandes',
      livreurs: '/api/livreurs'
    }
  });
});

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Backend fonctionne !' });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/livreurs", livreurRoutes);

export default app;