import { connectDB, getDB } from "./dal/database";
import { ARTICLE_COLLECTION } from "./models/article.model";
import { COMMANDE_COLLECTION } from "./models/commande.model";

async function seedData() {
  await connectDB();

  const db = getDB();

  // Articles de test
  const articles = [
    { designation: "Ordinateur portable Dell XPS 13", quantite: 10, prix: 1299.99 },
    { designation: "Souris sans fil Logitech MX Master 3", quantite: 50, prix: 99.99 },
    { designation: "Clavier mécanique Corsair K95", quantite: 25, prix: 189.99 },
    { designation: "Écran 27 pouces LG UltraWide", quantite: 15, prix: 449.99 },
    { designation: "Casque audio Sony WH-1000XM4", quantite: 30, prix: 349.99 }
  ];

  // Commandes de test
  const commandes = [
    {
      numeroCommande: "CMD-2024-001",
      client: "Entreprise TechCorp",
      dateCommande: new Date("2024-01-15"),
      montantTotal: 2599.98,
      statut: "Livrée"
    },
    {
      numeroCommande: "CMD-2024-002",
      client: "Société Innovation Plus",
      dateCommande: new Date("2024-02-10"),
      montantTotal: 1749.95,
      statut: "En cours"
    },
    {
      numeroCommande: "CMD-2024-003",
      client: "Digital Solutions SA",
      dateCommande: new Date("2024-03-05"),
      montantTotal: 899.97,
      statut: "En attente"
    },
    {
      numeroCommande: "CMD-2024-004",
      client: "StartUp Innovante",
      dateCommande: new Date("2024-03-20"),
      montantTotal: 5199.96,
      statut: "Livrée"
    }
  ];

  try {
    // Vider les collections existantes
    await db.collection(ARTICLE_COLLECTION).deleteMany({});
    await db.collection(COMMANDE_COLLECTION).deleteMany({});

    // Insérer les nouvelles données
    const articlesResult = await db.collection(ARTICLE_COLLECTION).insertMany(articles);
    const commandesResult = await db.collection(COMMANDE_COLLECTION).insertMany(commandes);

    console.log(`✅ ${articlesResult.insertedCount} articles ajoutés`);
    console.log(`✅ ${commandesResult.insertedCount} commandes ajoutées`);
    console.log(`🎉 Données de test créées avec succès !`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la création des données:", error);
    process.exit(1);
  }
}

seedData();
