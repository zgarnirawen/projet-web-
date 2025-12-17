# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Build l'application Angular
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Exposer le port
EXPOSE 4201

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
