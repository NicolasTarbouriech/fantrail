# Architecture Domain Driven Design

Ce document décrit les conventions et l’implémentation du Domain Driven Design (DDD) au sein de nos applications, ainsi que l’organisation des librairies dans notre monorepo Nx.

L’objectif est de :

- Clarifier les responsabilités de chaque couche
- Garantir une séparation stricte des préoccupations
- Faciliter l’évolutivité, la testabilité et la compréhension du code

## Principes généraux

- Le domaine est central et indépendant de toute infrastructure
- Les dépendances vont de l’extérieur vers l’intérieur
- Le domaine ne dépend jamais de l’infrastructure ou de l’application
- Les interactions entre couches se font via des interfaces et des types explicites

## Découpage par couche

### 1. Domaine

Le domaine représente le cœur métier de l’application.
Il est totalement indépendant des frameworks, bases de données ou APIs.

#### Agrégats

- Objets métiers principaux
- Garants de la cohérence métier
- Encapsulent l’état et les comportements métier
- Toute mutation passe par un agrégat

#### Schémas de validation

- Validation structurelle des données
- Validation des invariants simples
- Utilisés à la création ou à la mutation des agrégats

#### Services de domaine

- Contiennent de la logique métier qui ne s'inscrit pas naturellement dans un agrégat unique
- Peuvent dépendre d'interfaces (ports) définies dans le domaine
- Ces interfaces sont implémentées dans l'infrastructure (pattern Ports & Adapters)
- Respectent l'inversion de dépendances : le domaine définit le contrat, l'infrastructure l'implémente

#### Événements de domaine

- Représentent un fait métier passé
- Définis uniquement avec des types simples :
- string
- number
- enum
- Aucun type technique ou dépendance externe
- Peuvent être émis par les agrégats

#### Repositories (interfaces)

- Définissent les contrats d’accès et de persistance des agrégats
- Exposent uniquement des intentions métier
- Ne contiennent aucune implémentation technique

### 2. Infrastructure

L’infrastructure est responsable des détails techniques.

Elle :

- Implémente les repositories définis dans le domaine
- Accède aux sources de données :
- Base de données
- APIs externes
- Services tiers
- Peut contenir :
- Mappers
- Clients HTTP
- ORM / Query builders
- Projections

⚠️ L’infrastructure dépend du domaine, jamais l’inverse.

### 3. Application

La couche application orchestre les cas d’usage.

Elle ne contient aucune logique métier complexe.

#### Queries

- Consultent et agrègent la donnée
- Utilisent exclusivement les repositories
- Ne mutent jamais l’état
- Peuvent assembler plusieurs sources de données

#### Commandes

- Représentent une intention de mutation
- Chargent les agrégats via les repositories
- Appellent les comportements métier des agrégats
- Persistent les changements via les repositories

#### Sagas

- Handlers réagissant aux événements de domaine
- Permettent d’orchestrer des processus métier longs
- Peuvent déclencher :
- D’autres commandes
- Des effets de bord
- Ne contiennent pas de logique métier cœur

## Organisation du monorepo Nx

Les librairies sont organisées par module métier, sous le dossier :

```bash
libs/modules/<module-name>
```

Chaque module est découpé selon les couches DDD.

### Convention de nommage

```bash
libs/modules/price/
├── domain
├── infrastructure
└── application
```

### domain

- Contient tout le domaine
- Agrégats
- Business rules
- Événements de domaine
- Interfaces de repositories
- Types métier

### infrastructure

- Implémentations des repositories
- Accès base de données / APIs
- Mappers et adaptateurs techniques
- Dépend du domain

### application

- Commandes
- Queries
- Sagas
- Cas d’usage applicatifs
- Dépend du domain et de l’infrastructure via interfaces

### Règles de dépendances

- domain
  - → aucune dépendance vers application ou infrastructure
- application
  - → dépend du domaine
  - → utilise les repositories via leurs interfaces
- infrastructure
  - → dépend du domaine
  - → implémente les repositories

### Bénéfices attendus

- Domaine clair, testable et isolé
- Faible couplage technique
- Évolutivité facilitée
- Meilleure lisibilité pour les nouveaux développeurs
- Alignement entre code et langage métier
