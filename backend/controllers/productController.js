const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const product = new Product({
  name, description, price, category, stock, imageURL: imageUrl
});
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageURL = result.secure_url;
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }; 

// const Product = require('../model/Product');
// const cloudinary = require('../config/cloudinary');

// const getproducts = async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getProductById = async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.json(product);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const createProduct = async (req, res) => {
//     try {
//         const { name, description, price, category, stock } = req.body;
//         const imageURL = req.file ? await cloudinary.uploader.upload(req.file.path) : null;

//         const product = new Product({
//             name,
//             description,
//             price,
//             category,
//             imageURL: imageURL ? imageURL.secure_url : null,
//             stock
//         });

//         const savedProduct = await product.save();
//         res.status(201).json(savedProduct);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
