// Ensure secure communication between Firebase Cloud Functions and the Python service:
// Use authenticated requests with Firebase Admin SDK or API keys.
exports.computeTechnicalIndicators = functions.firestore
  .document("ohlc_data_0xae81fac689a1b4b1e06e7ef4a2ab4cd8ac0a087d/{docId}") // {docId} is a wildcard
  .onCreate(async (snap, context) => {
    const newValue = snap.data();
    const documentId = context.params.docId; // Captures the document ID dynamically

    console.log("New document created in ohlc_data_0xae81...:", documentId);

    const axios = require("axios");
    const agentEndpoint = "https://dex-degen.ue.r.appspot.com/generate_trading_signals";
    
    try {
      // const response = await axios.post(agentEndpoint, newValue);
      const response = await axios.get(agentEndpoint);
      console.log("Python script executed successfully:", response.data);
    } catch (error) {
      console.error("Error executing Python script:", error);
    }
  });