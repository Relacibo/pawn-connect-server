import { Router } from 'express';
import simpleOAuth2 from 'simple-oauth2'
import status, { BAD_REQUEST, UNAUTHORIZED, OK } from 'http-status-codes';
import axios from 'axios';
import config from '../config';
import { sendPayloadWithParams } from '../templating'

const router = Router();

(() => {
  var wait15Seconds = false;

  const id = process.env.LICHESS_CLIENT_ID || config.lichessClientId;
  const secret = process.env.LICHESS_CLIENT_SECRET || config.lichessClientSecret;
  const hostName = process.env.HOSTNAME || config.hostName;
  const redirect_uri = `${hostName}/api/oauth/lichess/callback`
  const tokenHost = 'https://oauth.lichess.org';
  const authorizePath = '/oauth/authorize';
  const tokenPath = '/oauth';
  const scope = ['challenge:read', 'challenge:write', 'preference:read'].join(' ');

  const oauth2 = simpleOAuth2.create({
    client: { id, secret }, auth: { tokenHost, tokenPath, authorizePath }
  });
  const state = Math.random().toString(36).substring(2);
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri,
    scope,
    state
  });

  router.get('/lichess/authorize', (req, res) => {
    if (wait15Seconds) {
      res.json({ error: 'Wait one minute' });
      return;
    }
    console.log(authorizationUri);
    res.json({ authorizationUri });
  });

  router.get('/lichess/callback', async (req, res) => {
    const code: string = req.query.code as string;
    if (!code || typeof code !== 'string') {
      res.json({ error: 'code not set' });
      return;
    }
    const tokenConfig = { code, redirect_uri, scope };
    try {
      const result = await oauth2.authorizationCode.getToken(tokenConfig);
      sendPayloadWithParams({ lichess: result }, res)
    } catch (err) {
      onError(res);
    }
  });

  function onError(res: any) {
    res.status(status.TOO_MANY_REQUESTS).json({
      error: 'Wait 15Seconds',
    });
    wait15Seconds = true;
    setTimeout(() => {
      wait15Seconds = false;
    }, 15000)
    
  }

  router.post('/lichess/refresh', async (req, res) => {
    const refresh_token: string = req.query.refresh_token as string;
    if (!refresh_token || typeof refresh_token !== 'string') {
      res.json({ error: 'refresh_token not set' });
      return;
    }
    try {
      const response = await axios({
        method: 'post',
        url: `${tokenHost}${tokenPath}`,
        params: { 
          grant_type: 'refresh_token', 
          refresh_token, 
          client_id: id, 
          client_secret: secret }
      });
      res.send(response.data);
    } catch (err) {
      onError(res);
    }
  });
})();

export default router;