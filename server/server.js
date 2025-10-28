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

const app = express();

// ✅ Configure CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://acadevo-lms.vercel.app"
  ],
  credentials: true,
}));

// ✅ Clerk middleware (for protected routes)
app.use(clerkMiddleware());

// ⚠️ Webhook routes BEFORE express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ Clerk webhook needs JSON body
app.post('/clerk', express.json(), clerkWebhooks);

// ✅ Then regular JSON middleware
app.use(express.json());

// ✅ Connect DB + start server
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.use('/api/educator', requireAuth(), educatorRouter);
    app.use('/api/course', courseRouter);
    app.use('/api/user', requireAuth(), userRouter);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();

export default app;
