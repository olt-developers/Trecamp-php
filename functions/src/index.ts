import * as express from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { router as linebot } from './linebot';

admin.initializeApp({
  credential: admin.credential.cert(require('../config/serviceAccountKey.json')),
  databaseURL: 'https://trecamp-server.firebaseio.com',
});

const app = express();

const db = admin.firestore();

app.use('/callback', linebot);

app.get('/users', async (req, res, next) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => doc.data());
  console.log(users);
  res.json(users);
});

export const api = functions.https.onRequest(app);
