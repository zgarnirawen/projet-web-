import { getDB } from "../dal/database";
import { ICommande, COMMANDE_COLLECTION } from "../models/commande.model";
import { ARTICLE_COLLECTION } from "../models/article.model";
import { ObjectId } from "mongodb";

export class CommandeService {
  private collection() {
    return getDB().collection<ICommande>(COMMANDE_COLLECTION);
  }

  private articleCollection() {
    return getDB().collection(ARTICLE_COLLECTION);
  }

  async validateLignes(lignes: any[]) {
    if (!lignes || lignes.length === 0) {
      throw new Error("La commande doit contenir au moins un article");
    }

    for (const ligne of lignes) {
      // Convertir en nombre pour être sûr
      const quantiteDemandee = Number(ligne.quantite);

      // Vérifier que l'article existe
      const article = await this.articleCollection().findOne({ 
        designation: ligne.article 
      });

      if (!article) {
        throw new Error(`L'article "${ligne.article}" n'existe pas dans la base de données`);
      }

      // Vérifier que la quantité est positive
      if (quantiteDemandee <= 0 || isNaN(quantiteDemandee)) {
        throw new Error(`La quantité pour "${ligne.article}" doit être un nombre supérieur à 0`);
      }

      // Vérifier que la quantité demandée est disponible
      const stockDisponible = Number(article.quantite);
      if (quantiteDemandee > stockDisponible) {
        throw new Error(
          `Stock insuffisant pour "${ligne.article}". ` +
          `Disponible: ${stockDisponible}, Demandé: ${quantiteDemandee}`
        );
      }
    }
  }

  async updateStock(lignes: any[], operation: 'subtract' | 'add') {
    for (const ligne of lignes) {
      const quantite = Number(ligne.quantite);
      const updateValue = operation === 'subtract' ? -quantite : quantite;
      
      console.log(`📦 Mise à jour stock pour "${ligne.article}": ${updateValue > 0 ? '+' : ''}${updateValue}`);
      
      const result = await this.articleCollection().updateOne(
        { designation: ligne.article },
        { $inc: { quantite: updateValue } }
      );
      
      console.log(`✅ Article mis à jour: ${result.modifiedCount} document(s)`);
    }
  }

  async create(data: any) {
    // Valider les lignes de commande
    await this.validateLignes(data.lignes);

    // Déduire les quantités du stock
    await this.updateStock(data.lignes, 'subtract');

    const commande = {
      id: await this.getNextId(),
      idClient: data.idClient || 0,
      lignes: data.lignes || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.collection().insertOne(commande);
  }

  async getNextId() {
    const lastCommande = await this.collection()
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    return lastCommande.length > 0 ? lastCommande[0].id + 1 : 1;
  }

  getAll() {
    return this.collection().find().toArray();
  }

  getById(id: string) {
    return this.collection().findOne({ _id: new ObjectId(id) });
  }

  async update(id: string, data: any) {
    // Récupérer l'ancienne commande pour remettre le stock
    const oldCommande = await this.collection().findOne({ _id: new ObjectId(id) });
    
    if (oldCommande) {
      // Remettre les anciennes quantités dans le stock
      await this.updateStock(oldCommande.lignes, 'add');
    }

    // Valider les nouvelles lignes de commande
    if (data.lignes) {
      await this.validateLignes(data.lignes);
      // Déduire les nouvelles quantités du stock
      await this.updateStock(data.lignes, 'subtract');
    }

    const updateData: any = {
      ...data,
      updatedAt: new Date()
    };
    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  }

  async delete(id: string) {
    // Récupérer la commande pour remettre le stock
    const commande = await this.collection().findOne({ _id: new ObjectId(id) });
    
    if (commande) {
      // Remettre les quantités dans le stock
      await this.updateStock(commande.lignes, 'add');
    }

    return this.collection().deleteOne({ _id: new ObjectId(id) });
  }
}