const express = require('express');
const router = express.Router();
const {
  submitScreening,
  getScreeningsByChild,
  getScreeningDetail,
  getStats
} = require('../controllers/screeningController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/stats', protect, requireRole('health_officer', 'admin'), getStats);
router.post('/', protect, submitScreening);
router.get('/child/:child_id', protect, getScreeningsByChild);
router.get('/:id', protect, getScreeningDetail);

module.exports = router;