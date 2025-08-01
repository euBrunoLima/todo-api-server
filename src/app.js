import express from 'express';
import Routes from './app/routes/Routes.js';

const app = express();
app.use(express.json());

app.use('/api', Routes);


export default app;
