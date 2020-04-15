import { Router } from 'express';
import OAuthRouter from './oauth';

// Init router and path
const router = Router();

router.use('/oauth', OAuthRouter);

// Export the base-router
export default router;
