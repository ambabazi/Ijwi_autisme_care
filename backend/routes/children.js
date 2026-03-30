const express = require('express');
const router = express.Router();
const {
  registerChild,
  getMyChildren,
  getChildById,
  getAllChildren
} = require('../controllers/childrenController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const { validateChild } = require('../middleware/validate');

router.post('/', protect, validateChild, registerChild);
router.get('/all', protect, requireRole('health_officer', 'admin'), getAllChildren);
router.get('/', protect, getMyChildren);
router.get('/:id', protect, getChildById);

module.exports = router;