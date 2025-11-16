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
- **PostgreSQL** - Base de données
- **Jest** - Framework de tests

## Structure du projet

```
UrbanFlow-incidents/
├── src/
│   └── models/           # Modèles TypeScript (interfaces)
│       ├── incidentsEnums.ts
│       ├── categoryModel.ts
│       ├── userAccountModel.ts
│       ├── technicianModel.ts
│       ├── siteModel.ts
│       ├── incidentModel.ts
│       ├── assignmentModel.ts
│       ├── interventionModel.ts
│       ├── commentModel.ts
│       └── attachmentModel.ts
├── tests/                # Tests unitaires
│   ├── enums.test.ts
│   └── models.test.ts
├── sql/                  # Scripts SQL
│   └── incidents_schema.sql
└── package.json
```

## Installation

```bash
npm install
```

## Base de données

### Création du schéma

Pour créer la base de données PostgreSQL :

```bash
psql -U postgres
CREATE DATABASE urbanflow_incidents;
\c urbanflow_incidents
\i sql/incidents_schema.sql
```

### Structure des tables

- `categories` - Catégories d'incidents
- `user_accounts` - Comptes utilisateurs
- `technicians` - Profils des techniciens
- `sites` - Sites d'intervention
- `incidents` - Tickets d'incidents
- `assignments` - Affectations technicien-incident
- `interventions` - Interventions sur site
- `comments` - Commentaires sur les incidents
- `attachments` - Pièces jointes

## Tests

### Exécuter tous les tests

```bash
npm test
```

### Mode watch (développement)

```bash
npm run test:watch
```

### Couverture de code

```bash
npm run test:coverage
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
