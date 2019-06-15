import * as express from 'express';
import * as functions from 'firebase-functions';
import { router as linebot } from './linebot';
import { router as auth } from './auth';
import { db } from './firestore';

const app = express();

app.use('/callback', linebot);

app.use('/login', auth);

app.get('/users', async (req, res, next) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => doc.data());
  console.log(users);
  res.json(users);
});

export const api = functions.https.onRequest(app);
