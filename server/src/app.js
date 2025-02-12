import express from 'express'
import {authRouter} from '../routes/authRouter.js'
import {userRouter} from '../routes/userRouter.js'
import {searchRouter} from '../routes/searchRouter.js'
import {followerRouter} from '../routes/followerRouter.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import '../config/passport.js'
import 'dotenv/config'

const port = process.env.PORT;

const app = express()
app.use(express.json());
app.use(cors({origin:process.env.CLIENT_URL, credentials: true}));
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/search", searchRouter);
app.use("/follower", followerRouter);


app.get('/', (req, res) => {
  res.json({"status": "online"})
})

app.get("/failed", (req, res) => {
  res.status(401).json({error: 'Authentication failed'})
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)
})