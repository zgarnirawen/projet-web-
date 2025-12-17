# 🐳 Guide Docker - ERP Application

## Prérequis
- Docker Desktop installé et en cours d'exécution
- Docker Compose installé (inclus avec Docker Desktop)

## 🚀 Démarrage rapide

### 1. Construire et démarrer tous les services
```bash
docker-compose up --build
```

### 2. Démarrer en arrière-plan (mode détaché)
```bash
docker-compose up -d
```

### 3. Arrêter tous les services
```bash
docker-compose down
```

### 4. Arrêter et supprimer les volumes (⚠️ supprime les données MongoDB)
```bash
docker-compose down -v
```

## 📦 Services disponibles

| Service | Port | URL |
|---------|------|-----|
| Frontend (Angular) | 4201 | http://localhost:4201 |
| Backend (Express) | 5201 | http://localhost:5201 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## 🔧 Commandes utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Redémarrer un service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Reconstruire un service
```bash
docker-compose build backend
docker-compose build frontend
```

### Exécuter une commande dans un conteneur
```bash
# Backend
docker-compose exec backend npm run seed

# MongoDB
docker-compose exec mongodb mongosh erp
```

## 🗄️ Gestion de la base de données

### Réinitialiser la base de données
```bash
docker-compose exec backend npm run reset-db
```

### Seed la base de données
```bash
docker-compose exec backend npm run seed
```

### Accéder à MongoDB Shell
```bash
docker-compose exec mongodb mongosh erp
```

## 🛠️ Développement

Pour le développement avec hot-reload, il est recommandé d'utiliser les commandes npm directement plutôt que Docker :

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📝 Variables d'environnement

Les variables d'environnement sont configurées dans `docker-compose.yml` :

**Backend:**
- `NODE_ENV=production`
- `MONGODB_URI=mongodb://mongodb:27017/erp`
- `PORT=5201`

## 🔍 Troubleshooting

### Le frontend ne peut pas se connecter au backend
Vérifiez que le proxy nginx est correctement configuré dans `frontend/nginx.conf`.

### MongoDB ne démarre pas
```bash
docker-compose down -v
docker-compose up --build
```

### Port déjà utilisé
Arrêtez les processus Node.js existants :
```bash
# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -like '*node*'} | Stop-Process -Force
```

## 📊 Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Angular)     │
│   Port: 4201    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │
│   (Express)     │
│   Port: 5201    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MongoDB       │
│   Port: 27017   │
└─────────────────┘
```

## ✅ Vérification de l'installation

Après `docker-compose up`, vérifiez que tous les services sont en cours d'exécution :

```bash
docker-compose ps
```

Vous devriez voir :
- erp-mongodb (Up)
- erp-backend (Up)
- erp-frontend (Up)

## 🎯 Production

Pour déployer en production, considérez :
1. Utiliser des variables d'environnement sécurisées
2. Configurer MongoDB avec authentification
3. Utiliser un reverse proxy (Nginx/Traefik)
4. Configurer HTTPS avec Let's Encrypt
5. Mettre en place des backups MongoDB réguliers
