import { Router } from 'express';
import simpleOAuth2 from 'simple-oauth2'
import status, { BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';
import config from '@root/config';

const router = Router();

const id = config.clientId;
const secret = config.clientSecret;
const hostName = config.hostName;
const path = '/api/oauth'
const redirect_uri = `${hostName}${path}/callback`
const tokenHost = 'https://oauth.lichess.org';
const authorizePath = '/oauth/authorize';
const tokenPath = '/oauth';
const scope = [
  'challenge:read', 'challenge:write'
].join(' ');

const oauth2 = simpleOAuth2.create({
  client: {id, secret}, auth: {tokenHost, tokenPath, authorizePath}
});

router.get('/authorize', (req, res) => {
  const state = Math.random().toString(36).substring(2);
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri,
    scope,
    state
  });
  res.json({ authorizationUri });
});

router.get('/callback', async (req, res) => {
  const code: string = req.query.code as string;
  if (code || typeof code != 'string') {
    res.status(BAD_REQUEST);
    return;
  }
  const tokenConfig = { code, redirect_uri, scope };
  try {
    const result = await oauth2.authorizationCode.getToken(tokenConfig);
    const accessToken = oauth2.accessToken.create(result);
  } catch {
    res.status(UNAUTHORIZED);
  }

})

export default router;