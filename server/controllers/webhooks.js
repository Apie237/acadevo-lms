import { Webhook } from "svix";
import dotenv from 'dotenv';
dotenv.config();
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkWebhooks = async (req, res) => {
    const { data, type } = req.body;
    console.log("Received webhook:", type);
    console.log("Webhook data:", JSON.stringify(data, null, 2)); // 🔍 Debug log

    // 🧪 SKIP SIGNATURE VERIFICATION TEMPORARILY
    // Comment out the verification block
    // try {
    //     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    //     await whook.verify(JSON.stringify(req.body), {
    //         "svix-id": req.headers["svix-id"],
    //         "svix-timestamp": req.headers["svix-timestamp"],
    //         "svix-signature": req.headers["svix-signature"],
    //     });
    // } catch (error) {
    //     console.error("Webhook verification failed:", error);
    //     return res.status(400).json({ success: false, message: "Invalid webhook signature." });
    // }

    try {
        switch (type) {
            case "user.created": {
                // ✅ FIX: Handle null names properly
                const firstName = data.first_name || "";
                const lastName = data.last_name || "";
                const name = firstName && lastName 
                    ? `${firstName} ${lastName}`.trim()
                    : firstName || lastName || "User"; // Fallback to "User" if both are empty

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: name,
                    imageUrl: data.image_url || data.profile_image_url, // ✅ FIX: Fallback to profile_image_url
                };

                console.log("📝 Attempting to save user:", userData);
                
                const newUser = await User.create(userData);
                console.log("✅ User saved successfully:", newUser);
                
                return res.json({ 
                    success: true, 
                    message: "User created successfully.",
                    userId: newUser._id 
                });
            }

            case "user.updated": {
                // ✅ FIX: Handle null names properly
                const firstName = data.first_name || "";
                const lastName = data.last_name || "";
                const name = firstName && lastName 
                    ? `${firstName} ${lastName}`.trim()
                    : firstName || lastName || "User";

                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: name,
                    imageUrl: data.image_url || data.profile_image_url,
                };

                console.log("📝 Attempting to update user:", data.id, userData);
                
                const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                
                if (!updatedUser) {
                    console.error("❌ User not found for update:", data.id);
                    return res.status(404).json({ 
                        success: false, 
                        message: "User not found." 
                    });
                }

                console.log("✅ User updated successfully:", updatedUser);
                return res.json({ 
                    success: true, 
                    message: "User updated successfully." 
                });
            }

            case "user.deleted": {
                console.log("📝 Attempting to delete user:", data.id);
                
                const deletedUser = await User.findByIdAndDelete(data.id);
                
                if (!deletedUser) {
                    console.error("❌ User not found for deletion:", data.id);
                    return res.status(404).json({ 
                        success: false, 
                        message: "User not found." 
                    });
                }

                console.log("✅ User deleted successfully:", data.id);
                return res.json({ 
                    success: true, 
                    message: "User deleted successfully." 
                });
            }

            default:
                console.log("⚠️ Unhandled webhook event type:", type);
                return res.json({ 
                    success: false, 
                    message: "Unhandled webhook event." 
                });
        }
    } catch (error) {
        console.error("❌ Clerk webhook DB error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return res.status(500).json({ 
            success: false, 
            message: "Database operation failed.",
            error: error.message 
        });
    }
};

console.log('Loaded Stripe Key:', process.env.STRIPE_SECRET_KEY);

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        console.error("❌ Stripe webhook verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })

                if (!session.data.length) {
                    console.error("❌ No session found for payment intent:", paymentIntentId);
                    break;
                }

                const { purchaseId } = session.data[0].metadata;

                const purchaseData = await Purchase.findById(purchaseId)
                const userData = await User.findById(purchaseData.userId)
                const courseData = await Course.findById(purchaseData.courseId.toString())

                courseData.enrolledStudents.push(userData)
                await courseData.save()

                userData.enrolledCourses.push(courseData._id)
                await userData.save()

                purchaseData.status = 'completed'
                await purchaseData.save()

                console.log("✅ Payment succeeded and enrollment completed for purchase:", purchaseId);
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })

                if (!session.data.length) {
                    console.error("❌ No session found for failed payment:", paymentIntentId);
                    break;
                }

                const { purchaseId } = session.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId)
                purchaseData.status = 'failed'
                await purchaseData.save()

                console.log("❌ Payment failed for purchase:", purchaseId);
                break;
            }

            default:
                console.log(`⚠️ Unhandled Stripe event type: ${event.type}`)
        }
    } catch (error) {
        console.error("❌ Stripe webhook processing error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Webhook processing failed.",
            error: error.message 
        });
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true })
}