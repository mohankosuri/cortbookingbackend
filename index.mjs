 // Import necessary modules
 import express from 'express'
 import bcrypt from 'bcrypt'
 import jwt from 'jsonwebtoken'
 import bodyParser from 'body-parser'
 import mongoose from 'mongoose'
 import { Product } from './models/Productmodal.mjs'
 import productsRouter from './routes/product.mjs'
 
 
 


// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MongoDB schema and model
const userSchema = new mongoose.Schema({
  fullname: String,
  mobile: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { fullname, mobile, password, confirmpassword } = req.body;

  // Check if passwords match
  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  try { 
    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ fullname, mobile, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { mobile, password } = req.body;

  try {
    // Find user by mobile number
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use('/product',productsRouter)
