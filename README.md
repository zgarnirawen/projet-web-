# 🏢 ERP Project - Enterprise Resource Planning

Application de gestion ERP complète avec Angular, Express.js, et MongoDB.

## 📋 Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation locale](#installation-locale)
- [Déploiement Docker](#déploiement-docker)
- [Configuration](#configuration)
- [Utilisation](#utilisation)

## ✨ Fonctionnalités

- 📦 **Gestion des Articles** : CRUD complet avec gestion automatique du stock
- 📋 **Gestion des Commandes** : Création de commandes avec validation de stock et déduction automatique
- 🚚 **Gestion des Livreurs** : Suivi des livreurs et de leur disponibilité
- 🔐 **Authentification** : JWT + Google OAuth
- 📊 **Dashboard** : Vue d'ensemble avec statistiques
- ✅ **Validation en temps réel** : Vérification du stock disponible avant commande

## 🛠️ Technologies utilisées

### Frontend
- **Framework** : Angular 21 avec Vite
- **Styling** : CSS3 avec gradients turquoise
- **Architecture** : Standalone components

### Backend
- **Runtime** : Node.js 18 avec TypeScript
- **Framework** : Express.js
- **Base de données** : MongoDB 8.0
- **Authentification** : JWT + Google OAuth

### DevOps
- **Containerisation** : Docker & Docker Compose
- **Reverse Proxy** : Nginx (pour le frontend)

## 🚀 Installation locale

### Prérequis
- Node.js 18+ (backend) et Node.js 20+ (frontend)
- MongoDB 8.0
- npm ou yarn

### 1. Cloner le repository
```bash
git clone <repository-url>
cd webb
```

### 2. Configurer le backend
```bash
cd backend
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos propres valeurs
```

### 3. Configurer le frontend
```bash
cd ../frontend
npm install
```

### 4. Initialiser la base de données
```bash
cd ../backend
npm run reset-db  # Réinitialise et seed la base de données
```

### 5. Démarrer l'application
```bash
# Depuis la racine du projet
cd ..
npm start  # Démarre backend + frontend simultanément
```

**URLs de développement :**
- Frontend : http://localhost:4200
- Backend API : http://localhost:5201
- MongoDB : mongodb://localhost:27017

## 🐳 Déploiement Docker

Pour un déploiement complet avec Docker, consultez [README-DOCKER.md](./README-DOCKER.md)

### Démarrage rapide
```bash
docker-compose up --build -d
```

**URLs Docker :**
- Frontend : http://localhost:4201
- Backend API : http://localhost:5201
- MongoDB : mongodb://localhost:27017

## ⚙️ Configuration

### Variables d'environnement (backend/.env)

```env
DB_URI=mongodb://127.0.0.1:27017/erp
PORT=5201
JWT_SECRET=your-secure-jwt-secret-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Configuration Google OAuth
Voir [GOOGLE_OAUTH_README.md](./GOOGLE_OAUTH_README.md) pour les instructions détaillées.

## 📖 Utilisation

### Gestion du stock automatique

Le système gère automatiquement le stock des articles :

1. **Création de commande** : Le stock est déduit automatiquement
2. **Modification de commande** : L'ancien stock est restauré, le nouveau est déduit
3. **Suppression de commande** : Le stock est restauré automatiquement
4. **Validation** : Empêche de commander plus que le stock disponible

### Endpoints API principaux

#### Articles
- `GET /api/articles` - Liste tous les articles
- `POST /api/articles` - Créer un article
- `PUT /api/articles/:id` - Modifier un article
- `DELETE /api/articles/:id` - Supprimer un article

#### Commandes
- `GET /api/commandes` - Liste toutes les commandes
- `POST /api/commandes` - Créer une commande (déduit le stock)
- `PUT /api/commandes/:id` - Modifier une commande (ajuste le stock)
- `DELETE /api/commandes/:id` - Supprimer une commande (restaure le stock)

#### Livreurs
- `GET /api/livreurs` - Liste tous les livreurs
- `POST /api/livreurs` - Créer un livreur
- `PUT /api/livreurs/:id` - Modifier un livreur
- `DELETE /api/livreurs/:id` - Supprimer un livreur

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/google` - Connexion Google OAuth

## 📁 Structure du projet

```
webb/
├── backend/                 # Application Express/TypeScript
│   ├── src/
│   │   ├── controllers/    # Contrôleurs des routes
│   │   ├── services/       # Logique métier
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Définition des routes
│   │   ├── middleware/     # Middleware (JWT, etc.)
│   │   └── dal/           # Data Access Layer (MongoDB)
│   ├── .env.example       # Template des variables d'environnement
│   └── Dockerfile         # Configuration Docker backend
├── frontend/               # Application Angular
│   ├── src/
│   │   └── app/
│   │       ├── articles/  # Module Articles
│   │       ├── commandes/ # Module Commandes
│   │       ├── livreurs/  # Module Livreurs
│   │       ├── auth/      # Module Authentification
│   │       ├── dashboard/ # Module Dashboard
│   │       └── shared/    # Services partagés
│   ├── nginx.conf         # Configuration Nginx
│   └── Dockerfile         # Configuration Docker frontend
├── docker-compose.yml      # Configuration Docker Compose
└── README.md              # Ce fichier
```

## 🔒 Sécurité

⚠️ **Important avant de pousser sur GitHub** :

1. **Ne jamais commiter le fichier `.env`** - Il contient des secrets
2. Les fichiers sensibles sont déjà dans `.gitignore`
3. Utilisez `.env.example` comme template
4. Changez le `JWT_SECRET` en production
5. Configurez vos propres credentials Google OAuth

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Scripts disponibles

### Backend
```bash
npm start        # Démarrer le serveur (ts-node)
npm run build    # Compiler TypeScript
npm run reset-db # Réinitialiser et seed la base de données
```

### Frontend
```bash
npm start        # Démarrer le dev server (Vite)
npm run build    # Build de production
```

### Racine
```bash
npm start        # Démarrer backend + frontend simultanément
```

## 📄 License

Ce projet est sous licence MIT.

## 👥 Auteurs

- Rawen Zgarni - Développement initial

## 🐛 Bugs connus et limitations

- Google OAuth nécessite une configuration dans Google Cloud Console
- Le port 4201 est utilisé pour Docker (4200 pour développement local)

## 📮 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
