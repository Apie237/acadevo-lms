// test-clerk-webhook.js
// Run this with: node test-clerk-webhook.js

const testWebhook = async () => {
    const webhookPayload = {
        "data": {
            "id": "user_34gtTX3CMSg9IunM8qnicVbmgPa",
            "email_addresses": [{
                "email_address": "cheforsylvanus@gmail.com",
                "id": "idn_34gtQ4wB4YgxRkFv1RQUOponfwd",
                "verification": {
                    "status": "verified",
                    "strategy": "email_code"
                }
            }],
            "first_name": "Chefor",
            "last_name": "Apiesez",
            "image_url": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zNDZSZDZsTklBU2NWUmZzRlp1NVFweUdGaUgiLCJyaWQiOiJ1c2VyXzM0Z3RUWDNDTVNnOUl1bk04cW5pY1ZibWdQYSIsImluaXRpYWxzIjoiQ0EifQ",
            "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
            "created_at": 1761647050316,
            "updated_at": 1761647050337
        },
        "type": "user.created"
    };

    // ✅ Your actual webhook endpoint
    const WEBHOOK_URL = 'https://acadevo-lms.vercel.app/clerk';

    console.log('🚀 Testing Clerk Webhook...\n');
    console.log('📤 Sending payload to:', WEBHOOK_URL);
    console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));
    console.log('\n---\n');

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
        });

        const responseData = await response.json();

        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Data:', JSON.stringify(responseData, null, 2));

        if (response.ok) {
            console.log('\n✅ SUCCESS! Webhook processed successfully.');
        } else {
            console.log('\n❌ FAILED! Check the error above.');
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        
        if (error.message.includes('not valid JSON')) {
            console.error('\n⚠️  Server returned HTML instead of JSON!');
            console.error('This usually means:');
            console.error('  1. ❌ Wrong URL - Check your webhook endpoint path');
            console.error('  2. ❌ Route not found (404 page)');
            console.error('  3. ❌ Server error returning error page');
            console.error('\n💡 Try these URLs:');
            console.error('     - https://acadevo-lms.vercel.app/api/webhooks/clerk');
            console.error('     - https://acadevo-lms.vercel.app/webhooks/clerk');
            console.error('     - https://acadevo-lms.vercel.app/api/clerk-webhook');
        } else {
            console.error('\nMake sure:');
            console.error('  1. Your server is running');
            console.error('  2. The WEBHOOK_URL is correct');
            console.error('  3. MongoDB is connected');
        }
    }
};

// Run the test
testWebhook();