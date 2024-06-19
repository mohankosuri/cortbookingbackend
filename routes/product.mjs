import express from "express";
import multer from "multer";
import { Product } from "../models/Productmodal.mjs";

const productsRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // You can change the destination as per your needs
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File naming convention
  }
});
const upload = multer({ storage: storage });

productsRouter.get('/', async (req, res) => {
  try {
    const product = await Product.find({});
    return res.status(200).json({
      count: product.length,
      data: product
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { productname, description, price } = req.body;
    if (!productname || !description || !price) {
      return res.status(400).send({ message: 'Send all fields' });
    }

    const newProduct = {
      productname,
      description,
      price,
      image: req.file.path // Save the image path
    };

    const product = await Product.create(newProduct);
    return res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { productname, description, price } = req.body;
    if (!productname || !description || !price) {
      return res.status(400).send({ message: 'Send all fields' });
    }

    const { id } = req.params;  
    const updateData = {
      productname,
      description,
      price
    };

    if (req.file) {
      updateData.image = req.file.path; // Update the image path if a new image is uploaded
    }

    const result = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
    
    
  }
});

export default productsRouter;
