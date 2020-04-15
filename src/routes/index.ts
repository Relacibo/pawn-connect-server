import { Router } from 'express';
import OAuthRouter from './oauth';
import PeerRouter from './peer';

// Init router and path
const router = Router();

router.use('/oauth', OAuthRouter);

router.use('/peer', PeerRouter);

// Export the base-router
export default router;
