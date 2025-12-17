import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userService = new UserService();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  // 🔐 LOGIN CLASSIQUE
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Vérifier que c'est un compte local
      if (user.provider !== 'local' || !user.password) {
        return res.status(401).json({ 
          message: "Ce compte utilise Google OAuth. Utilisez 'Continuer avec Google'" 
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Générer le JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('❌ Erreur login:', error);
      res.status(500).json({ message: "Erreur lors de la connexion", error });
    }
  }

  // 📝 REGISTER CLASSIQUE
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Cet email est déjà utilisé" });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await userService.create({
        email,
        password: hashedPassword,
        name,
        provider: 'local',
        role: 'USER'
      });

      // Générer le JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('❌ Erreur register:', error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  }

  // 🌐 GOOGLE OAUTH
  async googleAuth(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ message: "Token Google requis" });
      }

      // Vérifier le token Google
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID!
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(401).json({ message: "Token Google invalide" });
      }

      const { email, name, sub: googleId, picture } = payload;

      console.log('🔍 Google Auth:', { email, name, googleId });

      // Chercher l'utilisateur par email ou googleId
      let user = await userService.findByEmail(email);

      if (user) {
        // Utilisateur existant
        console.log('✅ Utilisateur existant trouvé');
        
        // Si l'utilisateur existe mais n'a pas de googleId, l'ajouter
        if (!user.googleId && user.provider === 'local') {
          await userService.updateGoogleId(email, googleId);
          user.googleId = googleId;
        }
      } else {
        // Nouvel utilisateur - auto-registration
        console.log('➕ Création d\'un nouvel utilisateur Google');
        
        user = await userService.create({
          email,
          name: name || email.split('@')[0],
          provider: 'google',
          googleId,
          role: 'USER'
        });
      }

      // Générer le JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider
        }
      });
    } catch (error) {
      console.error('❌ Erreur Google Auth:', error);
      res.status(500).json({ message: "Erreur lors de l'authentification Google", error });
    }
  }
}
