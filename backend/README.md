# Backend - Monetiser-mon-gpts

Ce dossier contient le code backend pour le projet Monetiser-mon-gpts.

## Configuration

1. Assurez-vous d'avoir Python 3.8+ installé sur votre système.

2. Créez un environnement virtuel :
   ```
   python -m venv venv
   ```

3. Activez l'environnement virtuel :
   - Sur Windows : `venv\Scripts\activate`
   - Sur macOS et Linux : `source venv/bin/activate`

4. Installez les dépendances :
   ```
   pip install -r requirements.txt
   ```

5. Configurez les variables d'environnement en copiant le fichier `.env.example` vers `.env` et en modifiant les valeurs selon vos besoins.

## Exécution

Pour lancer le serveur de développement :

```
python app.py
```

Le serveur sera accessible à l'adresse `http://localhost:5000`.

## Structure du projet

- `app.py`: Point d'entrée de l'application
- `config.py`: Configuration de l'application
- `models.py`: Définition des modèles de données
- `routes.py`: Définition des routes de l'API
- `requirements.txt`: Liste des dépendances Python
- `.env`: Variables d'environnement (à ne pas committer)

## Déploiement

Pour le déploiement en production, assurez-vous de :

1. Configurer correctement les variables d'environnement
2. Utiliser un serveur WSGI comme Gunicorn
3. Configurer une base de données appropriée (par exemple, PostgreSQL)

Vous pouvez utiliser le fichier `Procfile` pour le déploiement sur des plateformes comme Heroku.

## Contribution

Pour contribuer au projet, veuillez créer une branche à partir de `main`, effectuer vos modifications, et soumettre une pull request pour révision.