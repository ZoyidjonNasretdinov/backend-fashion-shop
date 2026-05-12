
const Replicate = require('replicate');
require('dotenv').config();

async function testReplicate() {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    console.log("Checking Replicate connection...");
    // Just list models or try a very simple lightweight call if possible, 
    // but usually checking if we can fetch account info or similar is better.
    // Replicate package doesn't have a simple 'whoami', let's try to get a model info.
    const model = await replicate.models.get("cuuupid", "idm-vton");
    console.log("✅ Replicate connection successful! Model found:", model.name);
  } catch (error) {
    console.error("❌ Replicate connection failed:", error.message);
  }
}

testReplicate();
