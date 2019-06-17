import * as express from 'express';
import * as passport from 'passport';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as LocalStrategy from 'passport-local';
import { noncesRef, usersRef } from './firestore';

export const router = express.Router();

// https://qiita.com/naoko_s/items/523acad62ab4ba18891e
// https://www.pospome.work/entry/20150608/1433757625
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const snapshot = await usersRef.where('email', '==', email).get();
      const user = snapshot.docs.map(doc => doc.data())[0];
      if (!user) {
        return done(null, false, { message: 'incorrect email' });
      }
      const res = await bcrypt.compare(password, user.password.replace('$2y$', '$2a$'));
      if (!res) {
        return done(null, false, { message: 'incorrect password' });
      }
      return done(null, user);
    }
  )
);

router.post('/', (req, res, next) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect('local');
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      if (typeof req.headers.referer !== 'string') {
        return;
      }
      const linkToken = req.headers.referer.split('linkToken=')[1];
      const nonce = createNonce(16);
      noncesRef.doc(nonce).set({
        uid: user.uid,
      });
      return res.redirect(
        `https://access.line.me/dialog/bot/accountLink?linkToken=${linkToken}&nonce=${nonce}`
      );
    });
  })(req, res, next);
});

const createNonce = (N: number, key?: string) => {
  return crypto
    .randomBytes(N)
    .toString('Base64')
    .substring(0, N);
};
