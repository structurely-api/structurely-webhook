const express = require('express');
const dotenv = require('dotenv');
const { validateStructurelyWebhook } = require('./middleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Simple health check endpoint
app.get('/', (req, res) => {
  res.send('Webhook server is running');
});

// Webhook endpoint
app.post('/webhook', validateStructurelyWebhook, (req, res) => {
  try {
    console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));
    
    // Get the webhook data
    const eventMetadata = req.body.eventMetadata || {};
    const eventPayload = req.body.eventPayload || {};
    
    // Check if conditions are met
    const isFinished = eventMetadata.isFinished === true;
    const isAnalyzed = eventMetadata.isAnalyzed === true;
    const hasRecordingUrl = !!eventPayload.recordingUrl;
    
    if (isFinished && isAnalyzed && hasRecordingUrl) {
      // Process the webhook data
      console.log('Processing webhook data:', {
        leadId: req.body.leadId,
        callId: eventPayload.callId,
        recordingUrl: eventPayload.recordingUrl
      });
      
      // Here you would add your custom logic to process the data
      // For example, send to another API, store in database, etc.
      
      res.status(200).json({
        status: 'success',
        message: 'Webhook processed successfully'
      });
    } else {
      console.log('Webhook conditions not met:', {
        isFinished,
        isAnalyzed,
        hasRecordingUrl
      });
      
      // Return success but indicate no processing
      res.status(200).json({
        status: 'skipped',
        message: 'Webhook conditions not met'
      });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process webhook'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
