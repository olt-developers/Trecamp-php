import * as express from 'express';
import * as functions from 'firebase-functions';
import * as passport from 'passport';
import { router as linebot } from './linebot';
import { router as auth } from './auth';
import { db } from './firestore';
import { EndPoints } from './constants';

const app = express();

app.use(passport.initialize());
app.use(passport.session());

// about LINE bot
app.use(EndPoints.LineCallback, linebot);
app.use(EndPoints.LineLogin, auth);

// about Trecamp
app.get(EndPoints.Users, async (req, res, next) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => doc.data());
  res.json(users);
});

export const api = functions.https.onRequest(app);
