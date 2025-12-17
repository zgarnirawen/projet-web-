import { ObjectId } from 'mongodb';
import { getDB } from '../dal/database';
import { ILivreur, LIVREUR_COLLECTION } from '../models/livreur.model';

export class LivreurService {
  static async getAll(): Promise<ILivreur[]> {
    const db = getDB();
    const livreurs = await db.collection<ILivreur>(LIVREUR_COLLECTION).find().toArray();
    return livreurs;
  }

  static async getById(id: string): Promise<ILivreur | null> {
    const db = getDB();
    const livreur = await db.collection<ILivreur>(LIVREUR_COLLECTION).findOne({ _id: new ObjectId(id) } as any);
    return livreur;
  }

  static async create(livreur: ILivreur): Promise<ILivreur> {
    const db = getDB();
    const result = await db.collection<ILivreur>(LIVREUR_COLLECTION).insertOne(livreur);
    return { ...livreur, _id: result.insertedId.toString() };
  }

  static async update(id: string, livreur: Partial<ILivreur>): Promise<ILivreur | null> {
    const db = getDB();
    // Retirer _id des données à mettre à jour (MongoDB ne permet pas de modifier _id)
    const { _id, ...updateData } = livreur;
    const result = await db.collection<ILivreur>(LIVREUR_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDB();
    const result = await db.collection<ILivreur>(LIVREUR_COLLECTION).deleteOne({ _id: new ObjectId(id) } as any);
    return result.deletedCount === 1;
  }
}
