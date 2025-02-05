import express from 'express'
import {authRouter} from '../routes/authRouter.js'
import {userRouter} from '../routes/userRouter.js'
import {verifyToken} from '../config/passport.js'
import '../config/passport.js'
import 'dotenv/config'

const port = process.env.PORT;

const app = express()
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);


app.get('/', (req, res) => {
  res.json({"status": "online"})
})
app.get('/protected', verifyToken, (req, res)=>{
  res.json('Protected Route');
}), 

app.get("/failed", (req, res) => {
  res.status(401).json({error: 'Authentication failed'})
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)
})