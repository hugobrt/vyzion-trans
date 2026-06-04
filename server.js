require('dotenv').config();
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA = path.join(__dirname, 'data/photos.json');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'vyzion-trans', allowed_formats: ['jpg','jpeg','png','webp'] } });
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'vyzion2024', resave: false, saveUninitialized: false }));

if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, '[]');
const getPhotos = () => JSON.parse(fs.readFileSync(DATA));
const savePhotos = (p) => fs.writeFileSync(DATA, JSON.stringify(p, null, 2));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin', (req, res) => { if (!req.session.admin) return res.redirect('/login'); res.sendFile(path.join(__dirname, 'public/admin.html')); });
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.post('/login', (req, res) => { if (req.body.password === process.env.ADMIN_PASSWORD) { req.session.admin = true; res.redirect('/admin'); } else res.redirect('/login?err=1'); });
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/api/photos', (req, res) => res.json(getPhotos()));
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Non autorisé' });
  const photos = getPhotos();
  photos.unshift({ id: Date.now().toString(), url: req.file.path, title: req.body.title || '', country: req.body.country || '', category: req.body.category || 'Flotte' });
  savePhotos(photos);
  res.json({ ok: true });
});
app.delete('/api/photos/:id', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Non autorisé' });
  savePhotos(getPhotos().filter(p => p.id !== req.params.id));
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => console.log('Vyzion-Trans up'));
