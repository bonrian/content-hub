const express = require('express');
const router = express.Router();
const { 
  generate, 
  generateIdea, 
  improveIdea,
  generateBatchIdeas,
  getProviders 
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/ai/providers - Get available AI providers
router.get('/providers', getProviders);

// POST /api/ai/generate - Generate content with custom prompt
router.post('/generate', generate);

// POST /api/ai/idea - Generate content idea from topic
router.post('/idea', generateIdea);

// POST /api/ai/improve - Improve existing idea
router.post('/improve', improveIdea);

// POST /api/ai/batch-ideas - Generate batch of ideas from persona + industry
router.post('/batch-ideas', generateBatchIdeas);

module.exports = router;

