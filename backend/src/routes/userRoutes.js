const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  deleteUser,
  updateUser,
  restoreArchivedUser,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.delete('/me', protect, deleteUser)
router.put('/profile', protect, updateUser)
router.post('/restore', restoreArchivedUser)

module.exports = router
