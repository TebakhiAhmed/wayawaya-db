import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import SignUp from './authorization/SignUp.js'
import db from "./db.js"; // Ensure db.js correctly exports the MySQL connection pool

const app = express();
const port = 8001;
const SECRET_KEY = 'your_secret_key'; // Use a secure key in production

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Login API Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query to get the user by username
    const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    console.log(user);

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token, username: user.username, userType: user.type });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login API Route
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Query to get the user by username
//     db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
//       if (error) {
//         console.error('Error fetching user:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//       }

//       if (results.length === 0) {
//         return res.status(401).json({ message: 'Invalid username or password' });
//       }

//       const user = results[0];
//       console.log(user)

//       // Compare the provided password with the hashed password in the database
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid username or password' });
//       }

//       // Generate a token
//       const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' });
//       return res.json({ token ,username: user.username , userType: user.type});
//     });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// SignUp API Route
app.post("/api/signUp", SignUp);

// Add Product API Route
app.post("/api/addProduct", async (req, res) => {
  const { productName, productType, productQuantity, productPrice } = req.body;

  try {
    await db.query(
      "INSERT INTO products (product_name, product_type, product_qun, product_price) VALUES (?, ?, ?, ?)",
      [productName, productType, productQuantity, productPrice]
    );
    res.json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add Product API Route
// app.post("/api/addProduct", (req, res) => {
//   const { productName, productType, productQuantity, productPrice } = req.body;

//   db.query(
//     "INSERT INTO products (product_name, product_type, product_qun, product_price) VALUES (?, ?, ?, ?)",
//     [productName, productType, productQuantity, productPrice],
//     (error, results) => {
//       if (error) {
//         console.error("Error inserting data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json({ message: "Product added successfully!" });
//       }
//     }
//   );
// });

// Get Users API Route
app.get("/api/get-users", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    res.json(results);
  } catch (error) {
    console.error("Error selecting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Users API Route
// app.get("/api/get-users", (req, res) => {
//   db.query(
//     "SELECT * FROM users",
//     (error, results) => {
//       if (error) {
//         console.error("Error selecting data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });

// Get Products API Route
app.get("/api/get-products", async (req, res) => {
  try {
    // Use await to get results from the promise-based query
    const [results] = await db.query("SELECT * FROM products");

    // Respond with the results
    res.json(results);
  } catch (error) {
    console.error("Error selecting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Product API Route
// app.put('/api/update-product/:id', (req, res) => {
//   const { id } = req.params; // Extract the ID from the URL parameters
//   const { product_name, product_price, product_qun, product_type } = req.body; // Extract the product details from the request body

//   // Check if all required fields are provided
//   if (!id || !product_name || !product_price || !product_type) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Update the product in the database
//   db.query(
//     'UPDATE products SET product_name = ?, product_price = ?, product_qun = ?, product_type = ? WHERE idproducts = ?',
//     [product_name, product_price, product_qun, product_type, id],
//     (error, results) => {
//       if (error) {
//         console.error('Error updating product:', error);
//         res.status(500).send('Server error');
//       } else {
//         res.status(200).json({ message: 'Product updated successfully' });
//       }
//     }
//   );
// });

// Update Product API Route
app.put('/api/update-product/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL parameters
  const { product_name, product_price, product_qun, product_type } = req.body; // Extract the product details from the request body

  // Check if all required fields are provided
  if (!id || !product_name || !product_price || !product_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.query(
      'UPDATE products SET product_name = ?, product_price = ?, product_qun = ?, product_type = ? WHERE idproducts = ?',
      [product_name, product_price, product_qun, product_type, id]
    );
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Server error');
  }
});



// Delete Product API Route
// app.delete('/api/delete-product/:id', (req, res) => {
//   const { id } = req.params;

//   db.query(
//     'DELETE FROM products WHERE idproducts = ?',
//     [id],
//     (error, results) => {
//       if (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).send('Server error');
//       } else {
//         res.status(200).send('Product deleted successfully');
//       }
//     }
//   );
// });

// Delete Product API Route
app.delete('/api/delete-product/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      'DELETE FROM products WHERE idproducts = ?',
      [id]
    );
    res.status(200).send('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Server error');
  }
});


// Add Order API Route
// app.post("/api/add-order", (req, res) => {
//   const { order, order_date, payment_method } = req.body;
//   const totalAmount = order.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
//   // Convert UTC time to Central European Summer Time (CEST)
//   const orderDate = moment(order_date).tz('Europe/Prague').format('YYYY-MM-DD HH:mm:ss');

//   db.query(
//     "INSERT INTO `order` (order_items, total_amount, order_date , payment_method) VALUES (?, ?, ? , ?)",
//     [JSON.stringify(order), totalAmount, orderDate , payment_method],
//     (error, results) => {
//       if (error) {
//         console.error("Error inserting order:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json({ message: "Order received and inserted successfully!" });
//       }
//     }
//   );
// });

// Add Order API Route
app.post("/api/add-order", async (req, res) => {
  const { order, order_date, payment_method } = req.body;
  const totalAmount = order.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  // Convert UTC time to Central European Summer Time (CEST)
  const orderDate = moment(order_date).tz('Europe/Prague').format('YYYY-MM-DD HH:mm:ss');

  try {
    await db.query(
      "INSERT INTO `order` (order_items, total_amount, order_date , payment_method) VALUES (?, ?, ? , ?)",
      [JSON.stringify(order), totalAmount, orderDate , payment_method]
    );
    res.json({ message: "Order received and inserted successfully!" });
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Orders API Route
// app.get("/api/get-orders", (req, res) => {
//   db.query("SELECT * FROM `order`", (error, results) => {
//     if (error) {
//       console.error("Error fetching orders:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.json(results);
//     }
//   });
// });

// Get Orders API Route
app.get("/api/get-orders", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM `order`");
    res.json(results);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update User API Route
// app.put('/update/:id', async (req, res) => {
//   const { id } = req.params;
//   const { username, password } = req.body;

//   try {
//     if (username) {
//       await new Promise((resolve, reject) => {
//         db.query(
//           'UPDATE users SET username = ? WHERE idusers = ?',
//           [username, id],
//           (error, results) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(results);
//             }
//           }
//         );
//       });
//     }

//     if (password) {
//       if (password.length < 6) {
//         return res.status(400).send('Password must be at least 6 characters long');
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       await new Promise((resolve, reject) => {
//         db.query(
//           'UPDATE users SET password = ? WHERE idusers = ?',
//           [hashedPassword, id],
//           (error, results) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(results);
//             }
//           }
//         );
//       });
//     }

//     res.send('User updated successfully');
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).send('Server error');
//   }
// });

// Update User API Route
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    if (username) {
      await db.query(
        'UPDATE users SET username = ? WHERE idusers = ?',
        [username, id]
      );
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE users SET password = ? WHERE idusers = ?',
        [hashedPassword, id]
      );
    }

    res.send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server error');
  }
});


// Delete User API Route
// app.delete('/delete/:id', (req, res) => {
//   const { id } = req.params;
  
//   db.query(
//     'DELETE FROM users WHERE idusers = ?',
//     [id],
//     (error, results) => {
//       if (error) {
//         console.error('Error deleting user:', error);
//         res.status(500).send('Server error');
//       } else {
//         res.send('User deleted successfully');
//       }
//     }
//   );
// });

// Delete User API Route
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      'DELETE FROM users WHERE idusers = ?',
      [id]
    );
    res.send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});



// Update Product Quantity API Route
// app.post("/api/update-product-quantity", (req, res) => {
//   const { productName, quantity } = req.body;

//   db.query(
//     "UPDATE products SET product_qun = product_qun - ? WHERE product_name = ?",
//     [quantity, productName],
//     (error, results) => {
//       if (error) {
//         console.error("Error updating product quantity:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json({ message: "Product quantity updated successfully!" });
//       }
//     }
//   );
// });
// Update Product Quantity API Route
app.post("/api/update-product-quantity", async (req, res) => {
  const { productName, quantity } = req.body;

  try {
    await db.query(
      "UPDATE products SET product_qun = product_qun - ? WHERE product_name = ?",
      [quantity, productName]
    );
    res.json({ message: "Product quantity updated successfully!" });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
