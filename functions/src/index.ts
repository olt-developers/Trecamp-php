import * as express from 'express';
import * as functions from 'firebase-functions';

const app = express();

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
