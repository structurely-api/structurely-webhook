// Authentication middleware for Structurely webhook
const validateStructurelyWebhook = (req, res, next) => {
  const structurelySecret = process.env.STRUCTURELY_WEBHOOK_SECRET;
  const providedSecret = req.headers['x-webhook-secret'];
  
  // Check if secret is configured
  if (!structurelySecret) {
    console.warn('No Structurely webhook secret configured. Skipping validation.');
    return next();
  }
  
  // Validate the webhook secret
  if (!providedSecret || providedSecret !== structurelySecret) {
    console.error('Invalid Structurely webhook secret provided.');
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid webhook secret'
    });
  }
  
  // Secret is valid, proceed
  console.log('Structurely webhook secret validated successfully');
  next();
};

module.exports = {
  validateStructurelyWebhook
};
