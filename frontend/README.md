# Frontend - Monetiser-mon-gpts

Ce dossier contient le code frontend pour le projet Monetiser-mon-gpts.

## Configuration

1. Assurez-vous d'avoir Node.js (version 12 ou sup�rieure) install� sur votre syst�me.

2. Installez les d�pendances :
   ```
   npm install
   ```

3. Cr�ez un fichier `.env` � la racine du dossier frontend et ajoutez les variables d'environnement n�cessaires, par exemple :
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## D�veloppement

Pour lancer l'application en mode d�veloppement :

```
npm start
```

L'application sera accessible � l'adresse `http://localhost:3000`.

## Build de production

Pour cr�er une version de production :

```
npm run build
```

Cela cr�era un dossier `build` avec les fichiers optimis�s pour la production.

## Tests

Pour ex�cuter les tests :

```
npm test
```

## Structure du projet

- `src/`: Contient le code source de l'application
- `public/`: Contient les fichiers statiques
- `package.json`: Liste des d�pendances et scripts npm
- `.env`: Variables d'environnement (� ne pas committer)

## D�ploiement

Pour d�ployer l'application, vous pouvez utiliser le dossier `build` g�n�r� et le servir avec un serveur web statique comme Nginx ou utiliser des services de d�ploiement comme Netlify ou Vercel.

## Contribution

Pour contribuer au projet, veuillez cr�er une branche � partir de `main`, effectuer vos modifications, et soumettre une pull request pour r�vision.