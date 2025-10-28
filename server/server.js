import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoute.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

// Initialize express app
const app = express();

// Global middleware
app.use(cors());
app.use(clerkMiddleware());

// ⚠️ CRITICAL: Webhook routes MUST come BEFORE express.json() middleware
// Stripe webhook needs raw body
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Clerk webhook needs JSON body
app.post('/clerk', express.json(), clerkWebhooks);

// JSON parsing middleware for all other routes
app.use(express.json());

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    // Regular routes
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.use('/api/educator', requireAuth(), educatorRouter);
    app.use('/api/course', courseRouter);
    app.use('/api/user', requireAuth(), userRouter);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(`✅ Server is running on port ${PORT}`)
    );
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();

// Export for Vercel serverless
export default app;