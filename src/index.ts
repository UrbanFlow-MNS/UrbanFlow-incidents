import { AppDataSource } from './data-source';

async function main() {
  try {
    // connnexion à la base de données
    await AppDataSource.initialize();
    console.log('✓ Connexion à la base de données établie');

    // Exemple pour plus tard (pour moi): récupérer toutes les catégories
    // const categoryRepository = AppDataSource.getRepository(Category);
    // const categories = await categoryRepository.find();
    // console.log(categories);

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

main();
