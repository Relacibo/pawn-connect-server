import { Router } from 'express';
import config from 'src/config';

// Init router and path
const router = Router();

const scriptFileName = process.env.NODE_ENV === 'development' ? 'index.js' : 'index.min.js';

router.get('*', (req, res) => {
  let paramsJson = "";
  res.render('index', {
      title: 'Chess Manage',  
      clientPublicFolder: config.clientPublicFolder,
      scriptFileName: scriptFileName,
      paramsJson
  });
});

// Add sub-routes
//router.use('/users', UserRouter);

// Export the base-router
export default router;