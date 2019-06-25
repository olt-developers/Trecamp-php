import * as express from 'express';
import * as functions from 'firebase-functions';
import * as passport from 'passport';
import { router as linebot } from './linebot';
import { router as auth } from './routes/auth';
import { router as users } from './routes/users';
import { router as trainings } from './routes/trainings';
import { EndPoints } from './constants';

const app = express();

app.use(passport.initialize());
app.use(passport.session());

// about LINE bot
app.use(EndPoints.LineCallback, linebot);
app.use(EndPoints.LineLogin, auth);

// about Trecamp
app.use(EndPoints.Users, users);
app.use(EndPoints.Trainings, trainings);

export const api = functions.https.onRequest(app);
