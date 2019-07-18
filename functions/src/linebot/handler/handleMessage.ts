import * as line from '@line/bot-sdk';
import * as request from 'request';
import { MessageEvent } from '@line/bot-sdk';
import { lineToken } from '../config';
import { usersRef } from '../../firestore';

// TODO: とりあえずこのメソッドに全部書いて、あとでファイル分割しましょう
export const handleMessage = async (
  client: line.Client,
  profile: line.Profile,
  event: MessageEvent
): Promise<any> => {
  if (event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let text = '';

  // 従来の文法(例↓)
  // トレキャン1
  // オリエン10
  if (event.message.text.includes('トレキャン')) {
    // 文字列解析

    // こんなデータを作る
    // const postData = {
    //   uid: 1,
    //   date: Date.now(), // 書式決めちゃおう(timestamp or string ...)
    //   type: 1,
    //   value: 10
    // }

    // APIエンドポイントにリクエストを投げる
    // こんな感じ（曖昧だから調べて＞＜）
    // uri: http://localhost:5000/trecamp-server/us-central1/api/trainings
    // json: postData
    // request.post(...)
    return;
  }

  if (event.message.text === '連携') {
    const snapshot = await usersRef.where('lineId', '==', event.source.userId).get();
    const user = snapshot.docs.map(doc => doc.data())[0];
    if (!user) {
      return postAccountLink(profile);
    }
    text = `id:${user.uid}\nname:${user.displayName}\nemail:${user.email}\nで登録済みです。`;
  } else {
    text = '[連携]で話しかけてね！';
  }

  const echo: line.TextMessage = {
    text,
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
              uri: `https://trecamp-55883.firebaseapp.com/lineLogin?linkToken=${linkToken}`,
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
