import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://dbAdmin:lollol336@checkpointcluster.4ghhr.mongodb.net/CheckPointDB?retryWrites=true&w=majority&appName=CheckPointCluster";

app.use(cors());
app.use(express.json())

import userRoutes from './routes/user.routes.js';
app.use('/api/user', userRoutes);

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
