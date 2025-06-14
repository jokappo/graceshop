## Présentation du projet

**graceshop** est une application de commerce électronique conçue pour offrir une expérience d'achat en ligne fluide et sécurisée. Ce projet inclut un serveur backend qui gère les produits, les utilisateurs, les commandes et les paiements.

## Fonctionnalités principales

- Gestion des utilisateurs (inscription, connexion, rôles)
- Catalogue de produits (ajout, modification, suppression, affichage)
- Gestion du panier d'achat
- Passage de commandes et suivi
- Paiement sécurisé
- Interface d'administration

## Technologies utilisées

- **Node.js** et **Express** pour le backend
- **MongoDB** pour la base de données
- **JWT** pour l'authentification
- **Stripe** ou autre service pour les paiements

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement dans un fichier `.env`.
4. Lancez le serveur:

   ```bash
   npm start
   ```

   ## Configuration des variables d'environnement

   Créez un fichier `.env` à la racine du projet et ajoutez-y les variables suivantes :

   ```env
   FROMTEND_URL = "********"
   MONGODB_URL = ********
   RESEND_API_KEY = ********
   SECRET_KEY_ACCESS_TOKEN = ********
   SECRET_KEY_REFRESH_TOKEN = ********
   CLOUDINARY_CLOUD_NAME = ********
   CLOUDINARY_API_KEY = ********
   CLOUDINARY_API_SECRET = ********
   CLOUDINARY_URL = ********
   STRIPE_SECRET_KEY = ********
   STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY = ********
   ```

   ### Outils utilisés dans le `.env`

   | Variable                             | Description                                         |
   | ------------------------------------ | --------------------------------------------------- |
   | `FROMTEND_URL`                       | URL du frontend de l'application                    |
   | `MONGODB_URL`                        | URL de connexion à la base de données MongoDB       |
   | `RESEND_API_KEY`                     | Clé API pour l'envoi d'e-mails                      |
   | `SECRET_KEY_ACCESS_TOKEN`            | Clé secrète pour les tokens d'accès JWT             |
   | `SECRET_KEY_REFRESH_TOKEN`           | Clé secrète pour les tokens de rafraîchissement JWT |
   | `CLOUDINARY_CLOUD_NAME`              | Nom du cloud Cloudinary                             |
   | `CLOUDINARY_API_KEY`                 | Clé API Cloudinary                                  |
   | `CLOUDINARY_API_SECRET`              | Secret API Cloudinary                               |
   | `CLOUDINARY_URL`                     | URL de connexion Cloudinary                         |
   | `STRIPE_SECRET_KEY`                  | Clé secrète Stripe pour les paiements               |
   | `STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY` | Clé secrète du webhook Stripe                       |

## Structure du projet

- `/models` : Modèles de données (utilisateur, produit, commande)
- `/routes` : Routes API
- `/controllers` : Logique métier
- `/config` : Configuration de la base de données et des services externes

## Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request pour proposer des améliorations.

## Licence

Ce projet est sous licence MIT.
