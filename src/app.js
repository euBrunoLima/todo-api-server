import express from 'express';
import cors from 'cors';
import Routes from './app/routes/Routes.js';

const app = express();
app.use(express.json());
app.use(cors({
    // origin: 'http://localhost:5173', // seu frontend React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/api', Routes);


export default app;
