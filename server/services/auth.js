import pool from '../../config/db.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';


export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, comments, password } = req.body;

   
    if (!first_name || !last_name || !email || !password) {
      return res.render('add-user', { 
        message: 'Please fill out all required fields.',
        formData: req.body
      });
    }
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
         return res.render('add-user', { 
        message: 'This email address is already in use. Please use a different one.',
        formData: req.body 
      });
    }

    const hashedPassword = await hashPassword(password);
    
    const query = 'INSERT INTO users (first_name, last_name, email, phone, comments, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [first_name, last_name, email, phone, comments || '', hashedPassword, 'user'];
    
    const [result] = await pool.query(query, values);

    req.session.isLoggedIn = true;
    req.session.user = {
      id: result.insertId,
      name: first_name,
      role: 'user'
    };

    req.session.save(() => res.redirect('/home'));

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Server Error');
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.render('login', { message: 'Invalid email or password.' });
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.render('login', { message: 'Invalid email or password.' });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      id: user.id,
      name: user.first_name,
      role: user.role 
    };
    req.session.save(() => res.redirect('/home'));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
};

export const checkSession = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};
export const checkPermission = (allowedRoles) => {
  return (req, res, next) => {
    console.log('hello');
    const userRole = req.session.user.role;
    if (allowedRoles.includes(userRole)) {
      next(); 
    } else {
      res.status(403).send('Forbidden: You do not have permission for this action.');
    }
  };
};

export const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};