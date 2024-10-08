import db from '../db.js';
import bcrypt from 'bcrypt';

const signUp = async (req, res) => {
  const { userName, password, userType } = req.body;
  const dataComing = {userName,password,userType};
  console.log(dataComing)

  if (!userName || !password || !userType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the username already exists
    const [results] = await db.query('SELECT * FROM users WHERE username = ?', [userName]);
    console.log([results]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await db.query('INSERT INTO users (username, password, type) VALUES (?, ?, ?)', [userName, hashedPassword, userType]);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Duplicate entry' });
    }

    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default signUp;
