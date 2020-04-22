import { Router, Response} from 'express';

// Init router and path
const router = Router();
const clientPublicFolder = process.env.CLIENT_PUBLIC_FOLDER || '';
const jsImports = [
  'react.js',
  'react-dom.js',
  'redux.js',
  'peerjs.js',
  'main.js'
]

export function sendPayloadWithParams(params: any, res: Response<any>) {
  let paramsJson = null;
  if (params) {
    paramsJson = JSON.stringify(params);
  }
  res.render('index', {
    title: 'Pawn Connect',
    clientPublicFolder,
    jsImports,
    paramsJson
  });
}

router.get('/*', (req, res) => {
  let query = null;
  if (req.query && Object.keys((req.query as any)).length > 0) {
    query = { query: req.query }
  }
  sendPayloadWithParams(query, res)
});

export default router;