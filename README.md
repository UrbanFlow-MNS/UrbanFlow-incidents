# UrbanFlow - Microservice Incidents

Microservice de gestion des incidents pour le projet Urban Flow.

## Description

Ce microservice gère l'ensemble du cycle de vie des incidents urbains, incluant :
- La création et le suivi des incidents
- L'affectation des techniciens
- La planification et le suivi des interventions
- Les commentaires et pièces jointes
- La gestion des sites et catégories

## Technologies

- **TypeScript** - Langage principal
- **Node.js** - Runtime
- **TypeORM** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **dotenv** - Configuration

## Structure du projet

```
UrbanFlow-incidents/
├── src/
│   ├── models/              # Entités TypeORM
│   │   ├── incidentsEnums.ts
│   │   ├── categoryModel.ts
│   │   ├── userAccountModel.ts
│   │   ├── technicianModel.ts
│   │   ├── siteModel.ts
│   │   ├── incidentModel.ts
│   │   ├── assignmentModel.ts
│   │   ├── interventionModel.ts
│   │   ├── commentModel.ts
│   │   └── attachmentModel.ts
│   ├── data-source.ts      # Configuration TypeORM
│   ├── init-db.ts          # Script initialisation DB
│   └── index.ts            # Point d'entrée
├── .env.example            # Template configuration
└── package.json
```

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos credentials PostgreSQL
```

## Configuration

Créez un fichier `.env` à la racine :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=urbanflow_incidents
NODE_ENV=development
```

## Base de données

### Création de la base

```bash
# Connexion à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE urbanflow_incidents;
```

### Initialisation des tables

TypeORM peut créer automatiquement les tables (mode développement) :

```bash
npm run db:init
```

En mode `synchronize: true`, TypeORM génère automatiquement le schéma à partir des entités.

### Structure des tables

TypeORM gère automatiquement les tables suivantes :

- `categories` - Catégories d'incidents
- `user_accounts` - Comptes utilisateurs
- `technicians` - Profils des techniciens
- `sites` - Sites d'intervention
- `incidents` - Tickets d'incidents
- `assignments` - Affectations technicien-incident
- `interventions` - Interventions sur site
- `comments` - Commentaires sur les incidents
- `attachments` - Pièces jointes

## Scripts npm

```bash
# Compiler TypeScript
npm run build

# Lancer en développement
npm run dev

# Initialiser/synchroniser la base de données
npm run db:init

# Commandes TypeORM
npm run typeorm migration:generate -- -n NomMigration
npm run typeorm migration:run
npm run typeorm migration:revert
```

## Utilisation

### Exemple d'utilisation des entités

```typescript
import { AppDataSource } from './data-source';
import { Category } from './models/categoryModel';

// Initialiser la connexion
await AppDataSource.initialize();

// Récupérer le repository
const categoryRepo = AppDataSource.getRepository(Category);

// Créer une catégorie
const category = categoryRepo.create({
  categoryName: 'Panne mécanique',
  isActive: true
});
await categoryRepo.save(category);

// Récupérer toutes les catégories
const categories = await categoryRepo.find();

// Fermer la connexion
await AppDataSource.destroy();
```

## Modèles de données

### Enums

- **IncidentStatus** : OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
- **IncidentPriority** : LOW, MEDIUM, HIGH, CRITICAL
- **InterventionStatus** : PLANNED, IN_PROGRESS, DONE

### Relations principales

- Un incident est lié à un site et une catégorie
- Un incident peut avoir plusieurs affectations de techniciens
- Une affectation génère une ou plusieurs interventions
- Un incident peut avoir plusieurs commentaires et pièces jointes

## Auteur

Projet Urban Flow - M2i2
