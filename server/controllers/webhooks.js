import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { Webhook } from "svix";

// Clerk Webhook Controller
export const clerkWebhooks = async (req, res) => {
  const { data, type } = req.body;
  console.log("📩 Clerk Webhook received:", type);

 //⚙️ Optional: Uncomment if you’re ready to verify signatures
 try {
   const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
   await whook.verify(JSON.stringify(req.body), {
     "svix-id": req.headers["svix-id"],
     "svix-timestamp": req.headers["svix-timestamp"],
     "svix-signature": req.headers["svix-signature"],
   });
 } catch (err) {
   console.error("❌ Clerk webhook verification failed:", err);
   return res.status(400).json({ success: false, message: "Invalid signature" });
 }

  try {
    switch (type) {
      case "user.created": {
        const newUser = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        await User.create(newUser);
        console.log("✅ New user created:", newUser.email);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const updatedUser = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, updatedUser);
        console.log("🔁 User updated:", updatedUser.email);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        return res.status(200).json({ success: true });
      }

      default:
        console.log("⚠️ Unhandled Clerk event:", type);
        return res.status(200).json({ success: false, message: "Unhandled event" });
    }
  } catch (error) {
    console.error("❌ Clerk webhook DB error:", error);
    return res.status(500).json({ success: false, message: "Database operation failed" });
  }
};

// Stripe Webhook Controller
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        const session = sessionList.data[0];
        const { purchaseId } = session.metadata;

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
          console.log("⚠️ Purchase not found:", purchaseId);
          break;
        }

        // Update purchase status
        purchase.status = "completed";
        await purchase.save();

        // Enroll user to course
        const user = await User.findById(purchase.userId);
        const course = await Course.findById(purchase.courseId);

        if (user && course) {
          if (!course.enrolledStudents.includes(user._id)) {
            course.enrolledStudents.push(user._id);
            await course.save();
          }

          if (!user.enrolledCourses.includes(course._id)) {
            user.enrolledCourses.push(course._id);
            await user.save();
          }

          console.log(`🎉 Enrollment successful for ${user.email}`);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        const session = sessionList.data[0];
        const { purchaseId } = session.metadata;

        const purchase = await Purchase.findById(purchaseId);
        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }

        console.log("❌ Payment failed for purchase:", purchaseId);
        break;
      }

      default:
        console.log(`⚠️ Unhandled Stripe event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Stripe webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
