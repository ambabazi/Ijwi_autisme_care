const express = require('express');
const router = express.Router();
const { registerChild, getMyChildren, getChildById } = require('../controllers/childrenController');
const { protect } = require('../middleware/authMiddleware');
const { validateChild } = require('../middleware/validate');

router.post('/', protect, validateChild, registerChild);
router.get('/', protect, getMyChildren);
router.get('/:id', protect, getChildById);

module.exports = router;