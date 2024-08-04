# Backend - Monetiser-mon-gpts

Ce dossier contient le code backend pour le projet Monetiser-mon-gpts.

## Configuration

1. Assurez-vous d'avoir Python 3.8+ install� sur votre syst�me.

2. Cr�ez un environnement virtuel :
   ```
   python -m venv venv
   ```

3. Activez l'environnement virtuel :
   - Sur Windows : `venv\Scripts\activate`
   - Sur macOS et Linux : `source venv/bin/activate`

4. Installez les d�pendances :
   ```
   pip install -r requirements.txt
   ```

5. Configurez les variables d'environnement en copiant le fichier `.env.example` vers `.env` et en modifiant les valeurs selon vos besoins.

## Ex�cution

Pour lancer le serveur de d�veloppement :

```
python app.py
```

Le serveur sera accessible � l'adresse `http://localhost:5000`.

## Structure du projet

- `app.py`: Point d'entr�e de l'application
- `config.py`: Configuration de l'application
- `models.py`: D�finition des mod�les de donn�es
- `routes.py`: D�finition des routes de l'API
- `requirements.txt`: Liste des d�pendances Python
- `.env`: Variables d'environnement (� ne pas committer)

## D�ploiement

Pour le d�ploiement en production, assurez-vous de :

1. Configurer correctement les variables d'environnement
2. Utiliser un serveur WSGI comme Gunicorn
3. Configurer une base de donn�es appropri�e (par exemple, PostgreSQL)

Vous pouvez utiliser le fichier `Procfile` pour le d�ploiement sur des plateformes comme Heroku.

## Contribution

Pour contribuer au projet, veuillez cr�er une branche � partir de `main`, effectuer vos modifications, et soumettre une pull request pour r�vision.