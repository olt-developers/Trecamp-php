import * as express from 'express';
import * as passport from 'passport';
import * as crypto from 'crypto';

export const router = express.Router();

// TODO: id, pass認証

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
      const N = 16;
      const nonce = crypto
        .randomBytes(N)
        .toString('Base64')
        .substring(0, N);
      return res.redirect(
        `https://access.line.me/dialog/bot/accountLink?linkToken=${linkToken}&nonce=${nonce}`
      );
    });
  })(req, res, next);
});

// {
//   "host": "fe31b056.ngrok.io",
//   "content-length": "25",
//   "cache-control": "max-age=0",
//   "origin": "http://localhost:3000",
//   "upgrade-insecure-requests": "1",
//   "content-type": "application/x-www-form-urlencoded",
//   "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
//   "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
//   "referer": "http://localhost:3000/login",
//   "accept-encoding": "gzip, deflate, br",
//   "accept-language": "ja,en-US;q=0.9,en;q=0.8",
//   "x-forwarded-proto": "https",
//   "x-forwarded-for": "175.177.5.48",
//   "connection": "close"
// }
