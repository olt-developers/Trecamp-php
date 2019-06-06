import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import * as express from 'express';
import * as request from 'request';
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
  middleware(req);
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

const middleware = (req: express.Request) => {
  const signature = req.get('x-line-signature');
  if (!signature) {
    throw new line.SignatureValidationFailed('no signature');
  }
  if (!line.validateSignature(JSON.stringify(req.body), lineToken.channelSecret, signature)) {
    throw new line.SignatureValidationFailed('signature validation failed', signature);
  }
};

const handleEvent = async (event: WebhookEvent): Promise<any> => {
  if (event.source.userId === undefined) {
    return Promise.resolve(null);
  }
  const profile = await client.getProfile(event.source.userId);

  if (event.type === 'accountLink') {
    if (event.link.result === 'ok') {
      client.replyMessage(event.replyToken, {
        text: `@${profile.displayName}さん、連携成功！`,
        type: 'text',
      });
    } else {
      client.replyMessage(event.replyToken, {
        text: `@${profile.displayName}さん、連携失敗...`,
        type: 'text',
      });
    }
  }

  if (event.type === 'message' && event.message.type === 'text') {
    if (event.message.text === '連携') {
      return postAccountLink(profile);
    }

    const echo: line.TextMessage = {
      text: `${profile.displayName}さん、${event.message.text}`,
      type: 'text',
    };
    return client.replyMessage(event.replyToken, echo);
  }

  return Promise.resolve(null);
};

const postAccountLink = (profile: line.Profile) => {
  const option = {
    headers: {
      Authorization: `Bearer ${lineToken.channelAccessToken}`,
    },
    uri: `https://api.line.me/v2/bot/user/${profile.userId}/linkToken`,
  };
  request.post(option, (err, res, body) => {
    const linkToken = JSON.parse(body).linkToken;
    const options = {
      headers: {
        Authorization: `Bearer ${lineToken.channelAccessToken}`,
        'Content-Type': 'application/json',
      },
      json: {
        messages: [
          {
            altText: 'Account Link',
            template: {
              actions: [
                {
                  label: 'ユーザー連携',
                  type: 'uri',
                  uri: `https://trecamp-55883.firebaseapp.com/login?linkToken=${linkToken}`,
                },
              ],
              text: 'Trecampとユーザー連携しますか？',
              type: 'buttons',
            },
            type: 'template',
          },
        ],
        to: profile.userId,
      },
      uri: 'https://api.line.me/v2/bot/message/push',
    };
    request.post(options);
  });
};
