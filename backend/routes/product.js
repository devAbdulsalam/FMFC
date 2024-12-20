import express from 'express';
import {
	// addProductImage,
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	// updateProductPrice,
	deleteProduct,
	deleteProducts,
	searchProducts,
	getProductCategories,
	createProductCategories,
	deleteCategory,
} from '../controllers/product.js';
import auth from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.post('/categories', createProductCategories);
router.get('/categories', getProductCategories);
router.get('/:id', getProduct);
router.post('/', auth, upload.single('file'), createProduct); // Create product
// router.patch('/:id', auth, updateProductPrice); // Update product price
router.put('/:id', auth, updateProduct); // Update product details
// router.put('/:id/image', upload.single('file'), addProductImage); // Update product image
router.delete('/', auth, deleteProducts);
router.delete('/categories/:id', auth, deleteCategory);
router.delete('/:id', auth, deleteProduct);

export default router;
