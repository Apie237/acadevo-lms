import axios from 'axios';

const testPayload = {
  type: "user.created",
  data: {
    id: "user_test124",
    first_name: "Test",
    last_name: "User",
    email_addresses: [
      {
        email_address: "chefor@example.com"
      }
    ],
    image_url: "https://www.gravatar.com/avatar?d=mp"
  }
};

const sendWebhook = async () => {
  try {
    const response = await axios.post('http://localhost:5000/clerk', testPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("✅ Webhook sent successfully:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ Webhook failed:", error.response.status, error.response.data);
    } else {
      console.error("❌ Webhook failed:", error.message);
    }
  }
};

sendWebhook();