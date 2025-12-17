export interface ILivreur {
  _id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  disponible: boolean;
  matriculeVehicule: string;
}

export const LIVREUR_COLLECTION = "livreurs";
