import * as line from '@line/bot-sdk';
import * as request from 'request';
import { MessageEvent } from '@line/bot-sdk';
import { lineToken } from '../config';

export const handleMessage = async (
  client: line.Client,
  profile: line.Profile,
  event: MessageEvent
): Promise<any> => {
  if (event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  if (event.message.text === '連携') {
    postAccountLink(profile);
  }

  const echo: line.TextMessage = {
    text: `${profile.displayName}さん、${event.message.text}`,
    type: 'text',
  };
  return client.replyMessage(event.replyToken, echo);
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
    const query = createPostJson(linkToken, profile);
    request.post(query);
  });
};

const createPostJson = (linkToken: string, profile: line.Profile): any => ({
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
});
