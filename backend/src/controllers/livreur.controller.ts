import { Request, Response } from 'express';
import { LivreurService } from '../services/livreur.service';

export class LivreurController {
  async getAll(req: Request, res: Response) {
    try {
      console.log('📥 GET /api/livreurs');
      console.log('🔍 LivreurController.getAll appelé');
      const livreurs = await LivreurService.getAll();
      console.log(`✅ ${livreurs.length} livreurs récupérés`);
      console.log('📊 Premier livreur:', JSON.stringify(livreurs[0]));
      res.json(livreurs);
    } catch (error) {
      console.error('❌ Erreur getAll livreurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      console.log(`📥 GET /api/livreurs/${req.params.id}`);
      const livreur = await LivreurService.getById(req.params.id);
      if (!livreur) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
      res.json(livreur);
    } catch (error) {
      console.error('❌ Erreur getById livreur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log('📥 POST /api/livreurs');
      console.log('📦 Données reçues:', req.body);
      const livreur = await LivreurService.create(req.body);
      console.log('✅ Livreur créé:', livreur);
      res.status(201).json(livreur);
    } catch (error) {
      console.error('❌ Erreur create livreur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      console.log(`📥 PUT /api/livreurs/${req.params.id}`);
      console.log('🔄 LivreurController.update appelé pour ID:', req.params.id);
      console.log('📦 Données reçues:', req.body);
      
      const livreur = await LivreurService.update(req.params.id, req.body);
      
      if (!livreur) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
      
      console.log('✅ Résultat update:', livreur);
      res.json(livreur);
    } catch (error) {
      console.error('❌ Erreur update livreur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      console.log(`📥 DELETE /api/livreurs/${req.params.id}`);
      const success = await LivreurService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
      console.log('✅ Livreur supprimé');
      res.json({ message: 'Livreur supprimé avec succès' });
    } catch (error) {
      console.error('❌ Erreur delete livreur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}
