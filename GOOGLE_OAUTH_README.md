# 🔐 Google OAuth 2.0 - Documentation Complète

## 📋 Vue d'ensemble

L'application ERP dispose maintenant de deux méthodes d'authentification:
1. **Login classique** - Email + mot de passe
2. **Google OAuth 2.0** - "Continuer avec Google"

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)

**Nouveaux fichiers créés:**
- `src/models/user.model.ts` - Modèle utilisateur avec support multi-provider
- `src/services/user.service.ts` - Service de gestion des utilisateurs
- `src/controllers/auth.controller.ts` - Contrôleur d'authentification (login, register, Google)
- `src/routes/auth.route.ts` - Routes d'authentification
- `src/create-users.ts` - Script de création d'utilisateurs de test

**Endpoints API:**
```
POST /api/auth/login       - Login classique
POST /api/auth/register    - Inscription classique
POST /api/auth/google      - Authentification Google
```

### Frontend (Angular)

**Fichiers modifiés:**
- `src/app/auth/login/login.component.ts` - Ajout de Google OAuth
- `src/app/auth/login/login.component.html` - Bouton Google
- `src/app/auth/login/login.component.css` - Styles

## 🔑 Configuration

### 1. Variables d'environnement (.env)

```env
DB_URI=mongodb://127.0.0.1:27017/erp
PORT=5201
JWT_SECRET=<votre-secret-jwt>
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Créer un projet (ou utiliser existant)
3. Activer "Google+ API"
4. Créer des identifiants OAuth 2.0
5. Ajouter les URI autorisées:
   - `http://localhost:4201`
   - `http://localhost:5201`

## 👥 Utilisateurs de test

**Comptes locaux (email/password):**
```
Email: admin@erp.com
Password: admin123
Role: ADMIN

Email: user@erp.com
Password: user123
Role: USER
```

**Comptes Google:**
Utilisez votre compte Google personnel - l'auto-registration créera automatiquement un compte avec role USER.

## 🔄 Flux d'authentification

### Login classique
```
1. User entre email + password
2. Frontend → POST /api/auth/login
3. Backend vérifie avec bcrypt
4. Backend génère JWT
5. Frontend stocke token + user
6. Redirection → /dashboard
```

### Google OAuth
```
1. User clique "Continuer avec Google"
2. Google Identity Services affiche popup
3. User s'authentifie sur Google
4. Google retourne idToken
5. Frontend → POST /api/auth/google {idToken}
6. Backend vérifie le token avec google-auth-library
7. Backend cherche utilisateur par email
   - Existe → Login
   - N'existe pas → Auto-registration
8. Backend génère JWT
9. Frontend stocke token + user
10. Redirection → /dashboard
```

## 🛡️ Sécurité

### Bonnes pratiques implémentées:

✅ **JWT avec expiration (24h)**
✅ **Mots de passe hashés avec bcrypt (10 rounds)**
✅ **Google Client Secret uniquement côté backend**
✅ **Vérification du token Google avec google-auth-library**
✅ **CORS configuré correctement**
✅ **Séparation provider (local vs google)**
✅ **Pas de mot de passe stocké pour comptes Google**

### Modèle utilisateur
```typescript
interface IUser {
  _id?: string;
  email: string;
  name: string;
  password?: string;        // Optionnel (absent pour Google)
  provider: 'local' | 'google';
  googleId?: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Installation

### 1. Backend
```bash
cd backend
npm install
npm run create-users   # Créer les utilisateurs de test
npm start              # Démarrer le serveur
```

### 2. Frontend
```bash
cd frontend
npm install
ng serve --port 4201   # Démarrer Angular
```

### 3. Ou les deux ensemble
```bash
npm start              # Depuis la racine du projet
```

## 🧪 Tests

### Test 1: Login classique
1. Ouvrir http://localhost:4201
2. Entrer `admin@erp.com` / `admin123`
3. Cliquer "Se connecter"
4. ✅ Doit rediriger vers /dashboard

### Test 2: Google OAuth
1. Ouvrir http://localhost:4201
2. Cliquer sur le bouton Google
3. Choisir un compte Google
4. ✅ Doit rediriger vers /dashboard
5. ✅ Vérifier dans MongoDB: nouveau user créé avec provider="google"

### Test 3: Liaison de compte
1. Créer un compte avec email X en login classique
2. Se déconnecter
3. Se connecter avec le même email X via Google
4. ✅ Le googleId doit être ajouté au compte existant

## 📊 Structure MongoDB

### Collection: user
```javascript
{
  _id: ObjectId("..."),
  email: "example@gmail.com",
  name: "John Doe",
  password: null,  // Pas de password pour Google
  provider: "google",
  googleId: "102345678901234567890",
  role: "USER",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

## ⚙️ Scripts NPM

```bash
# Backend
npm run create-users   # Créer utilisateurs de test
npm run reset-db       # Réinitialiser articles/commandes
npm start             # Démarrer backend

# Frontend
npm start             # Démarrer frontend

# Racine
npm start             # Démarrer backend + frontend
```

## 🔧 Dépannage

### Erreur: "Token Google invalide"
- Vérifier que le GOOGLE_CLIENT_ID dans le frontend correspond à celui du backend
- Vérifier que les URI autorisées sont configurées dans Google Cloud Console

### Erreur: "Email déjà utilisé"
- L'email existe déjà avec un autre provider
- Solution: Se connecter avec la méthode originale

### Le bouton Google ne s'affiche pas
- Vérifier la console du navigateur
- Le script Google Identity Services doit être chargé
- Vérifier que `GOOGLE_CLIENT_ID` est correct

## 📝 Notes importantes

1. **Développement seulement**: Les credentials actuels sont pour le développement local
2. **Production**: Créer de nouveaux credentials Google OAuth avec domaines de production
3. **HTTPS requis**: En production, Google OAuth nécessite HTTPS
4. **Confidentialité**: Ne jamais commit le `.env` avec les vrais secrets

## 📚 Ressources

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [google-auth-library](https://www.npmjs.com/package/google-auth-library)
- [JWT.io](https://jwt.io)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

✅ **L'authentification Google OAuth 2.0 est maintenant complètement fonctionnelle!**
