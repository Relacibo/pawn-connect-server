import config from '@root/config';
import { Router, Response} from 'express';

// Init router and path
const router = Router();
const clientPublicFolder = process.env.CLIENT_PUBLIC_FOLDER || config.clientPublicFolder;
const jsFileName = process.env.NODE_ENV === 'production' ? 'index.min.js' : 'index.js';
const cssFileName = 'style.css';

export function sendPayloadWithParams(params: any, res: Response<any>) {
  let paramsJson = JSON.stringify(params);
  res.render('index', {
    title: 'Chess Manage',
    clientPublicFolder,
    jsFileName,
    cssFileName,
    paramsJson
  });
}

router.get('/*', (req, res) => {
  sendPayloadWithParams(req.query, res)
});

export default router;