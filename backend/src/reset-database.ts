import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'erp';

async function resetDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);

    // Supprimer toutes les données existantes
    console.log('🗑️  Suppression des anciennes données...');
    await db.collection('article').deleteMany({});
    await db.collection('commande').deleteMany({});
    console.log('✅ Données supprimées');

    // Insérer les articles
    console.log('📦 Insertion des articles...');
    const articles = [
      { designation: "Cle USB 64GB", quantite: 120, prix: 9.99 },
      { designation: "Cahier A4 80 pages", quantite: 500, prix: 2.5 },
      { designation: "Stylo bille noir", quantite: 1000, prix: 0.45 },
      { designation: "Souris optique USB", quantite: 230, prix: 7.5 },
      { designation: "Casque audio supra-aural", quantite: 90, prix: 18.0 },
      { designation: "Chargeur universel 18W", quantite: 300, prix: 6.75 },
      { designation: "Bloc-notes adhesif (Post-it)", quantite: 420, prix: 2.1 },
      { designation: "Imprimante laser compacte", quantite: 15, prix: 129.99 },
      { designation: "Cartouche d'encre noire", quantite: 260, prix: 12.5 },
      { designation: "Clavier mecanique RGB", quantite: 48, prix: 59.0 },
      { designation: "Disque dur externe 1TB", quantite: 75, prix: 49.99 },
      { designation: "Lampe de bureau LED", quantite: 180, prix: 14.3 },
      { designation: "Sac a dos 15.6", quantite: 65, prix: 34.0 },
      { designation: "Adaptateur HDMI-VGA", quantite: 210, prix: 4.2 },
      { designation: "Webcam 1080p", quantite: 140, prix: 24.5 },
      { designation: "Cle HDMI 4K", quantite: 85, prix: 39.9 },
      { designation: "Support telephone bureau", quantite: 320, prix: 3.75 },
      { designation: "Ecouteurs intra-auriculaires", quantite: 410, prix: 5.9 },
      { designation: "Cable USB-C 1m", quantite: 600, prix: 2.0 },
      { designation: "Tapis de souris XXL", quantite: 150, prix: 7.25 }
    ];

    await db.collection('article').insertMany(articles);
    console.log(`✅ ${articles.length} articles insérés`);

    // Insérer les commandes
    console.log('📋 Insertion des commandes...');
    const commandes = [
      {
        id: 1,
        idClient: 101,
        lignes: [
          { article: "Cahier A4 80 pages", quantite: 2, prix: 2.5 },
          { article: "Stylo bille noir", quantite: 3, prix: 0.45 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        idClient: 102,
        lignes: [
          { article: "Souris optique USB", quantite: 1, prix: 7.5 },
          { article: "Clavier mecanique RGB", quantite: 1, prix: 59 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        idClient: 103,
        lignes: [
          { article: "Disque dur externe 1TB", quantite: 2, prix: 49.99 },
          { article: "Lampe de bureau LED", quantite: 1, prix: 14.3 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        idClient: 104,
        lignes: [
          { article: "Sac a dos 15.6", quantite: 1, prix: 34 },
          { article: "Adaptateur HDMI-VGA", quantite: 2, prix: 4.2 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        idClient: 105,
        lignes: [
          { article: "Webcam 1080p", quantite: 1, prix: 24.5 },
          { article: "Cle HDMI 4K", quantite: 1, prix: 39.9 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        idClient: 101,
        lignes: [
          { article: "Support telephone bureau", quantite: 2, prix: 3.75 },
          { article: "Ecouteurs intra-auriculaires", quantite: 1, prix: 5.9 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        idClient: 102,
        lignes: [
          { article: "Cable USB-C 1m", quantite: 3, prix: 2 },
          { article: "Tapis de souris XXL", quantite: 1, prix: 7.25 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        idClient: 103,
        lignes: [
          { article: "Imprimante laser compacte", quantite: 1, prix: 129.99 },
          { article: "Cartouche d'encre noire", quantite: 2, prix: 12.5 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        idClient: 104,
        lignes: [
          { article: "Cle USB 64GB", quantite: 5, prix: 9.99 },
          { article: "Cahier A4 80 pages", quantite: 3, prix: 2.5 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        idClient: 105,
        lignes: [
          { article: "Stylo bille noir", quantite: 10, prix: 0.45 },
          { article: "Souris optique USB", quantite: 2, prix: 7.5 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('commande').insertMany(commandes);
    console.log(`✅ ${commandes.length} commandes insérées`);

    // Vérification
    const articleCount = await db.collection('article').countDocuments();
    const commandeCount = await db.collection('commande').countDocuments();

    console.log('\n📊 État final de la base de données:');
    console.log(`   Articles: ${articleCount}`);
    console.log(`   Commandes: ${commandeCount}`);
    console.log('\n✅ Base de données réinitialisée avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('👋 Déconnexion de MongoDB');
  }
}

resetDatabase();
