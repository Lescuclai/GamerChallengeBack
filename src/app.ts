import express from 'express'
import cors from"cors"
import { config } from '../config.js'


export const app = express()


app.use(cors({origin: config.server.allowedOrigins}))

app.use(express.json());