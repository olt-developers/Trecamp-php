import * as express from 'express';
import * as passport from 'passport';

export const router = express.Router();

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
      console.log(req.header);
    });
  });
});
