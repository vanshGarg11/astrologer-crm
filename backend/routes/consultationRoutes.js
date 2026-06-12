const express = require('express');
const {
  createConsultation,
  deleteConsultation,
  getConsultation,
  listConsultations,
  updateConsultation,
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(listConsultations).post(createConsultation);
router.route('/:id').get(getConsultation).put(updateConsultation).delete(deleteConsultation);

module.exports = router;
