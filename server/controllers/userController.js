import pool from '../../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';

export const loginPage = (req, res) => {
  try {
    const message = req.query.message || null;
    res.render('login', { message }); 
  } catch (error) {
    console.error('Error rendering login page:', error);
    res.status(500).send('Server Error');
  }
};

export const view = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const [rows] = await pool.query('SELECT * FROM users');
    res.render('home', { rows, user: loggedInUser });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
};

export const edit = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.render('edit-user', { data: rows[0] });
  } catch (error) {
    console.error('Error fetching user for edit:', error);
    res.status(500).send('Server Error');
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params; 
    const { first_name, last_name, email, phone, comments } = req.body;
    const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?`;
    const values = [first_name, last_name, email, phone, comments, id];
    
    await pool.query(query, values);
    res.redirect('/home'); 
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server Error');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [userIdToDelete]);
    if (rows.length === 0) {
      return res.status(404).send('User not found.');
    }
    if (rows[0].role === 'admin') {
      return res.status(403).send('Forbidden: Administrator accounts cannot be deleted.');
    }
    await pool.query('DELETE FROM users WHERE id = ?', [userIdToDelete]);
    res.redirect('/home');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server Error');
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone, comments FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User not found.');
    }
    res.render('profile', { user: rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server Error');
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/');
  });
};


export const resetPassword = (req, res) => {
  try {
   res.render('reset-password')
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).send('Server Error');
  }
};


export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT id, email FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (user) {
      res.redirect(`/new-password/${user.id}`);
    } else {
  
      res.render('reset-password', {
        error: 'Invalid email. No account found with that address.'
      });
    }
  } catch (error) {
    console.error('Error in checkEmailAndRedirect:', error);
    res.status(500).send('Server Error');
  }
};


