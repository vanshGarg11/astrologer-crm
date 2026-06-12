const express = require('express');
const {
  createAstrologer,
  deleteAstrologer,
  getAstrologer,
  listAstrologers,
  updateAstrologer,
} = require('../controllers/astrologerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(listAstrologers).post(createAstrologer);
router.route('/:id').get(getAstrologer).put(updateAstrologer).delete(deleteAstrologer);

module.exports = router;
