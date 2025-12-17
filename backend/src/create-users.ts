import { getDB, connectDB, closeDB } from "./dal/database";
import bcrypt from "bcrypt";

const createUsers = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await connectDB();

    const db = getDB();
    const userCollection = db.collection('user');

    // Supprimer tous les utilisateurs existants
    await userCollection.deleteMany({});
    console.log('🗑️ Utilisateurs existants supprimés');

    // Créer les utilisateurs de test
    const users = [
      {
        email: 'admin@erp.com',
        name: 'Administrateur',
        password: await bcrypt.hash('admin123', 10),
        provider: 'local',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@erp.com',
        name: 'Utilisateur Test',
        password: await bcrypt.hash('user123', 10),
        provider: 'local',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await userCollection.insertMany(users);
    console.log(`✅ ${Object.keys(result.insertedIds).length} utilisateurs créés`);
    
    users.forEach(u => {
      console.log(`   📧 ${u.email} (${u.role})`);
    });

    await closeDB();
    console.log('✅ Terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createUsers();
