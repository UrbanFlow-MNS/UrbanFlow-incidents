import { AppDataSource } from './data-source';

async function initializeDatabase() {
  try {
    console.log('Initialisation de la connexion à la base de données...');
    await AppDataSource.initialize();
    console.log('✓ Connexion établie avec succès');
    console.log('✓ Tables synchronisées');
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✓ Connexion fermée');
    }
  }
}

initializeDatabase();
