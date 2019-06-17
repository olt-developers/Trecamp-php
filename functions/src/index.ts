import * as express from 'express';
import * as functions from 'firebase-functions';
import * as passport from 'passport';
import { router as linebot } from './linebot';
import { router as auth } from './auth';
import { db } from './firestore';

const app = express();

app.use('/callback', linebot);

app.use(passport.initialize());
app.use(passport.session());
app.use('/lineLogin', auth);

app.get('/users', async (req, res, next) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => doc.data());
  res.json(users);
});

export const api = functions.https.onRequest(app);
