import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Erlaubte Bildformate
const ERLAUBTE_TYPEN = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_GROESSE = 5 * 1024 * 1024; // 5 MB

// Multer speichert Dateien im uploads/ Ordner mit UUID-Dateinamen
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_GROESSE },
  fileFilter: (_req, file, cb) => {
    if (ERLAUBTE_TYPEN.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nur JPEG, PNG, WebP und GIF erlaubt'));
    }
  },
});

// POST /api/uploads — Bild hochladen (nur authentifizierte Mitarbeiter)
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  upload.single('bild')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ fehler: 'Datei zu groß (max. 5 MB)' });
        return;
      }
      res.status(400).json({ fehler: err.message });
      return;
    }
    if (err) {
      res.status(400).json({ fehler: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ fehler: 'Keine Datei hochgeladen' });
      return;
    }

    // URL zurückgeben — wird vom Frontend in bild_url gespeichert
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });
});

export default router;
