# Frontend - Monetiser-mon-gpts

Ce dossier contient le code frontend pour le projet Monetiser-mon-gpts.

## Configuration

1. Assurez-vous d'avoir Node.js (version 12 ou supérieure) installé sur votre système.

2. Installez les dépendances :
   ```
   npm install
   ```

3. Créez un fichier `.env` à la racine du dossier frontend et ajoutez les variables d'environnement nécessaires, par exemple :
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Développement

Pour lancer l'application en mode développement :

```
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`.

## Build de production

Pour créer une version de production :

```
npm run build
```

Cela créera un dossier `build` avec les fichiers optimisés pour la production.

## Tests

Pour exécuter les tests :

```
npm test
```

## Structure du projet

- `src/`: Contient le code source de l'application
- `public/`: Contient les fichiers statiques
- `package.json`: Liste des dépendances et scripts npm
- `.env`: Variables d'environnement (à ne pas committer)

## Déploiement

Pour déployer l'application, vous pouvez utiliser le dossier `build` généré et le servir avec un serveur web statique comme Nginx ou utiliser des services de déploiement comme Netlify ou Vercel.

## Contribution

Pour contribuer au projet, veuillez créer une branche à partir de `main`, effectuer vos modifications, et soumettre une pull request pour révision.