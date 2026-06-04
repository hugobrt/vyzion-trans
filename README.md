# Vyzion-Trans

## Setup (5 min)

### 1. Cloudinary gratuit
Crée un compte → [cloudinary.com](https://cloudinary.com)  
Dashboard → copie `Cloud name`, `API Key`, `API Secret`

### 2. Config
```bash
cp .env.example .env
# Remplis les 3 clés Cloudinary dans .env
```

### 3. Local
```bash
npm install
npm start
# Site : http://localhost:3000
# Admin : http://localhost:3000/admin  (mdp: 211109)
```

### 4. Déploiement Render (gratuit)
1. Push sur GitHub
2. render.com → New Web Service → connecte le repo
3. Variables d'env → ajoute les 4 variables du .env
4. Deploy
