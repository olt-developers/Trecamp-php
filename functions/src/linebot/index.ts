import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import * as express from 'express';
import { lineToken } from './config';
import { handleAccountLink } from './handler/handleAccountLink';
import { handleMessage } from './handler/handleMessage';
import { middleware } from './handler/middleware';

/**
 * https://firebase.google.com/docs/functions/http-events?hl=ja#read_values_from_the_request
 * https://github.com/firebase/firebase-functions/pull/420
 * https://line.github.io/line-bot-sdk-nodejs/api-reference/validate-signature.html
 * https://alpacat.hatenablog.com/entry/linebot-gcf
 * https://line.github.io/line-bot-sdk-nodejs/api-reference/middleware.html#usage
 *
 * https://blog.tanakamidnight.com/2018/09/firebase-clova-sdk-node8/
 * 解決？
 */
export const router = express.Router();

const client = new line.Client(lineToken as line.ClientConfig);

router.post('/', (req, res) => {
  middleware(req);
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

const handleEvent = async (event: WebhookEvent): Promise<any> => {
  if (event.source.userId === undefined) {
    return Promise.resolve(null);
  }
  const profile = await client.getProfile(event.source.userId);

  switch (event.type) {
    case 'accountLink':
      return handleAccountLink(client, profile, event);
    case 'message':
      return handleMessage(client, profile, event);
  }

  return Promise.resolve(null);
};
