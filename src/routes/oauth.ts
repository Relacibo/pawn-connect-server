import { Router } from 'express';
import simpleOAuth2 from 'simple-oauth2'
import status, { BAD_REQUEST, UNAUTHORIZED, OK} from 'http-status-codes';
import config from '../config';
import {sendPayloadWithParams} from '../templating'

const router = Router();

var wait15Seconds = false;

const id = process.env.LICHESS_CLIENT_ID || config.lichessClientId;
const secret = process.env.LICHESS_CLIENT_SECRET || config.lichessClientSecret;
const hostName = process.env.HOSTNAME || config.hostName;
const path = '/api/oauth'
const redirect_uri = `${hostName}${path}/callback`
const tokenHost = 'https://oauth.lichess.org';
const authorizePath = '/oauth/authorize';
const tokenPath = '/oauth';
const scope = ['challenge:read', 'challenge:write', 'preference:read'].join(' ');

const oauth2 = simpleOAuth2.create({
  client: {id, secret}, auth: {tokenHost, tokenPath, authorizePath}
});
const state = Math.random().toString(36).substring(2);
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri,
  scope,
  state
});

router.get('/authorize', (req, res) => {
  if (wait15Seconds) {
    res.json({error: 'Wait one minute'});
    return;
  }
  console.log(authorizationUri);
  res.json({ authorizationUri });
});

router.get('/callback', async (req, res) => {
  const code: string = req.query.code as string;
  if (!code || typeof code !== 'string') {
    res.json({error: 'code not set'});
    return;
  }
  const tokenConfig = { code, redirect_uri, scope };
  try {
    const result = await oauth2.authorizationCode.getToken(tokenConfig);
    sendPayloadWithParams({ lichessToken: result }, res)
  } catch (err) {
    res.json({
        error: 'Wait 15Seconds',
    });
    wait15Seconds = true;
    setTimeout(() => {
      wait15Seconds = false;
    }, 15000)
  }
})

export default router;