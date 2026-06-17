const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// All products
router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct);

// Specific product
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
