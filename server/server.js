import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webHooks.js';
import educatorRouter from './routes/educatorRoute.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(clerkMiddleware());

// ⚠️ WEBHOOKS MUST COME BEFORE express.json()
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);
app.post('/clerk', express.raw({type: 'application/json'}), clerkWebhooks);

// Now parse JSON for other routes
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    
    app.use('/api/educator', requireAuth(), educatorRouter);
    app.use('/api/course', courseRouter);
    app.use('/api/user', requireAuth(), userRouter);
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => 
      console.log(`Server is running on port ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();