import config from '@root/config';
import { Router } from 'express';

// Init router and path
const router = Router();
const clientPublicFolder = process.env.CLIENT_PUBLIC_FOLDER || config.clientPublicFolder;
const jsFileName = process.env.NODE_ENV === 'development' ? 'index.js' : 'index.min.js';
const cssFileName = 'style.css';

router.get('/*', (req, res) => {
  let paramsJson = JSON.stringify(req.query);
  res.render('index', {
    title: 'Chess Manage',
    clientPublicFolder,
    jsFileName,
    cssFileName,
    paramsJson
  });
});

export default router;