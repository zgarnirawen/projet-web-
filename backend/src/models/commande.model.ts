import { ObjectId } from "mongodb";

export interface ILigneCommande {
  article: string;
  quantite: number;
  prix: number;
}

export interface ICommande {
  _id?: ObjectId;
  id: number;
  idClient: number;
  lignes: ILigneCommande[];
  createdAt: Date;
  updatedAt: Date;
}

export const COMMANDE_COLLECTION = "commande";