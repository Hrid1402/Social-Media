import express from 'express'
import passport from 'passport'
import '../config/passport.js'
import 'dotenv/config'
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
        res.cookie("token", req.user.token, {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: 86400000,
          });
        console.log({token: req.user.token});
        res.redirect(process.env.CLIENT_URL);
    }
);

authRouter.get('/logout',  (req, res) =>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      })
    res.json({message: 'token deleted'});
}  
);
