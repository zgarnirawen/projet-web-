import { ObjectId } from "mongodb";

export interface IArticle {
  _id?: ObjectId;
  designation: string;
  quantite: number;
  prix: number;
}

export const ARTICLE_COLLECTION = "article";