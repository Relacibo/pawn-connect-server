import { Router } from 'express';
import simpleOAuth2 from 'simple-oauth2'
import status, { BAD_REQUEST, UNAUTHORIZED, OK} from 'http-status-codes';
import config from '../config';
import {sendPayloadWithParams} from '../templating'

const router = Router();

const id = process.env.LICHESS_CLIENT_ID || config.lichessClientId;
const secret = process.env.LICHESS_CLIENT_SECRET || config.lichessClientSecret;
const hostName = process.env.HOSTNAME || config.hostName;
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
  console.log(authorizationUri);
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
    console.log(accessToken);
    sendPayloadWithParams({accessToken}, res)
    
  } catch {
    res.status(UNAUTHORIZED);
  }

})

export default router;