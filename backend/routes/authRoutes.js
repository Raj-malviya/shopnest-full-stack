// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, getUsers } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
// const { admin } = require('../middleware/adminMiddleware');
// const { verifyEmail } = require('../controllers/authController');

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/users', protect, admin, getUsers);
// router.post("/verify-email", verifyEmail);

// module.exports = router;
const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail,
    resendOtp,
    deleteUser
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
