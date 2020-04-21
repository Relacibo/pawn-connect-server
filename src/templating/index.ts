import { Router, Response} from 'express';

// Init router and path
const router = Router();
const clientPublicFolder = process.env.CLIENT_PUBLIC_FOLDER || '';
const jsImports = [
  'react.js',
  'react-dom.js',
  'main.js'
]

export function sendPayloadWithParams(params: any, res: Response<any>) {
  let paramsJson = JSON.stringify(params);
  res.render('index', {
    title: 'Pawn Connect',
    clientPublicFolder,
    jsImports,
    paramsJson
  });
}

router.get('/*', (req, res) => {
  sendPayloadWithParams({ query: req.query }, res)
});

export default router;