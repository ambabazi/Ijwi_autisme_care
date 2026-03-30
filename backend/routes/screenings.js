const express = require('express');
const router = express.Router();
const { submitScreening, getScreeningsByChild, getScreeningDetail } = require('../controllers/screeningController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitScreening);
router.get('/child/:child_id', protect, getScreeningsByChild);
router.get('/:id', protect, getScreeningDetail);

module.exports = router;