import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import * as express from 'express';
import { lineToken } from './config';

/**
 * https://firebase.google.com/docs/functions/http-events?hl=ja#read_values_from_the_request
 * https://github.com/firebase/firebase-functions/pull/420
 * https://line.github.io/line-bot-sdk-nodejs/api-reference/validate-signature.html
 * https://alpacat.hatenablog.com/entry/linebot-gcf
 * https://line.github.io/line-bot-sdk-nodejs/api-reference/middleware.html#usage
 *
 * router？？ここのreq, resはexpressによるものでfirebaseではない？
 * https://blog.tanakamidnight.com/2018/09/firebase-clova-sdk-node8/
 * 解決？
 */
export const router = express.Router();

const client = new line.Client(lineToken as line.ClientConfig);

router.post('/', (req, res) => {
  const signature = req.get('x-line-signature');
  if (!signature) {
    throw new line.SignatureValidationFailed('no signature');
  }

  if (!line.validateSignature(JSON.stringify(req.body), lineToken.channelSecret, signature)) {
    throw new line.SignatureValidationFailed('signature validation failed', signature);
  }
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

const handleEvent = async (event: WebhookEvent): Promise<any> => {
  console.log(JSON.stringify(event));
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  if (event.source.userId === undefined) {
    return Promise.resolve(null);
  }
  const profile = await client.getProfile(event.source.userId);
  const echo: line.TextMessage = {
    text: `${profile.displayName}さん、${event.message.text}`,
    type: 'text',
  };
  return client.replyMessage(event.replyToken, echo);
};
