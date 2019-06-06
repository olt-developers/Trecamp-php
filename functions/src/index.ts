import * as express from 'express';
import * as functions from 'firebase-functions';
import { router as linebot } from './linebot';
const app = express();

// https://developers.line.biz/console/channel/1573235259/basic/
app.use('/callback', linebot);

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'イリヤ' },
    { id: 2, name: '美遊' },
    { id: 3, name: 'クロエ' },
    { id: 4, name: 'オルタ' },
    { id: 5, name: 'マシュ' },
  ];
  res.send(JSON.stringify(users));
});

export const api = functions.https.onRequest(app);
