# Guide d'Intégration Paystack pour Resume Builder

## Introduction

Cette documentation explique comment tester et utiliser l'intégration de Paystack dans l'application Resume Builder. L'intégration permet aux utilisateurs de s'abonner et d'accéder aux fonctionnalités premium comme le téléchargement des CV et des lettres de motivation.

## Flux de paiement

1. L'utilisateur clique sur le bouton de téléchargement dans l'application
2. Le modal de paiement s'affiche avec les options d'abonnement
3. L'utilisateur saisit son email et choisit un plan d'abonnement
4. L'utilisateur est redirigé vers la page de paiement Paystack
5. Après le paiement, l'utilisateur est redirigé vers une page de confirmation
6. L'abonnement est enregistré et l'utilisateur peut télécharger son document

## Cartes de test Paystack

Pour tester l'intégration sans faire de paiement réel, utilisez ces cartes de test fournies par Paystack:

### Carte de test avec succès

- Numéro de carte: `4084 0840 8408 4081`
- Date d'expiration: N'importe quelle date future (ex: 01/25)
- CVV: N'importe quel code à 3 chiffres (ex: 123)

### Carte de test avec échec

- Numéro de carte: `4084 0840 8408 4080`
- Date d'expiration: N'importe quelle date future
- CVV: N'importe quel code à 3 chiffres

### Carte de test avec authentification 3D Secure

- Numéro de carte: `5060 6660 0000 0000`
- Date d'expiration: N'importe quelle date future
- CVV: N'importe quel code à 3 chiffres

## Dépannage

Si vous rencontrez des problèmes avec l'intégration de paiement, voici quelques étapes à suivre:

### 1. Vérifiez les logs côté client

- Ouvrez les outils de développement du navigateur (F12)
- Consultez la console pour les messages d'erreur
- Vérifiez les requêtes réseau pour voir les réponses API

### 2. Vérifiez les logs côté serveur

- Consultez les logs du serveur pour les erreurs lors de l'initialisation ou de la vérification du paiement
- Assurez-vous que les clés Paystack sont correctes

### 3. Problèmes courants

- **Erreur CORS**: Assurez-vous que votre domaine est autorisé dans le tableau de bord Paystack
- **Erreur d'initialisation**: Vérifiez que votre clé publique est correcte
- **Échec de vérification**: Vérifiez que votre clé secrète est correcte

## Notes importantes

- En production, remplacez les clés de test par les clés de production
- Assurez-vous que les webhooks sont configurés pour gérer les événements de paiement récurrents
- Les abonnements sont actuellement gérés avec des cookies, une base de données devrait être utilisée en production

## Références

- [Documentation Paystack](https://paystack.com/docs/api/)
- [Cartes de test Paystack](https://paystack.com/docs/payments/test-payments/)
