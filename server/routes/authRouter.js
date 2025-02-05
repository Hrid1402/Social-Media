import express from 'express'
import passport from 'passport';
import '../config/passport.js'
export const authRouter = express.Router();

authRouter.get("/google",
  passport.authenticate('google', {
          session: false,
          scope:
              ['email', 'profile']
      }
  ));

authRouter.get('/google/callback', 
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/failed',
    }),
    (req, res) =>  {
        console.log(req.user);
        res.json({token: req.user.token});
    }
);
