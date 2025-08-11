import pool from '../../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';
import bcrypt from 'bcryptjs';
// For Login Page
export const loginPage = (req, res) => {
  try {
    const message = req.query.message || null;
    res.render('login', { message }); 
  } catch (error) {
    console.error('Error rendering login page:', error);
    res.status(500).send('Server Error');
  }
};
// To view homepage
export const view = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const [rows] = await pool.query('SELECT * FROM system');
    res.render('home', { rows, user: loggedInUser });
  } catch (error) {
    console.error('Error fetching system:', error);
    res.status(500).send('Server Error');
  }
};
// To Eidt user details
export const edit = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM system WHERE id = ?', [req.params.id]);
    res.render('edit-user', { data: rows[0] });
  } catch (error) {
    console.error('Error fetching user for edit:', error);
    res.status(500).send('Server Error');
  }
};
// To Update user details
export const update = async (req, res) => {
  try {
    const { id } = req.params; 
    const { first_name, last_name, email, phone, comments } = req.body;
    const query = `UPDATE system SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?`;
    const values = [first_name, last_name, email, phone, comments, id];
    
    await pool.query(query, values);


    req.session.admin = {
        id: update.id,
        name: update.first_name,
        role: update.role
      };
         


    res.redirect('/home'); 
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server Error');
  }
};
// To Delete User
export const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const [rows] = await pool.query('SELECT role FROM system WHERE id = ?', [userIdToDelete]);
    if (rows.length === 0) {
      return res.status(404).send('User not found.');
    }
    if (rows[0].role === 'admin') {
      return res.status(403).send('Forbidden: Administrator accounts cannot be deleted.');
    }
    await pool.query('DELETE FROM system WHERE id = ?', [userIdToDelete]);
    res.redirect('/home');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server Error');
  }
};
// To GetProfile
export const getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone, comments FROM system WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User not found.');
    }
    res.render('profile', { user: rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server Error');
  }
};
// To logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/');
  });
};
// To Reset-Password-Page
export const resetPassword = (req, res) => {
  try {
   res.render('reset-password')
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).send('Server Error');
  }
};
// To Check that email is valid or not 
export const CheckEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await pool.query('SELECT id FROM system WHERE email = ?', [email]);
    const user = rows[0];
    if (user) {
      res.redirect(`/new-password/${user.id}`);
    } else {
      
      res.render('reset-password', {
        error: 'No account found with that email address.'
      });
    }
  } catch (error) {
    console.error('Error in CheckEmail:', error);
    res.status(500).send('Server Error');
  }
};
// To Change Password
export const simpleSetNewPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.render('new-password', {
        error: 'Passwords do not match.',
        UserId: id 
      });
    }
    const newHashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE system SET password = ? WHERE id = ?', [newHashedPassword, id]);
    res.redirect('/');

  } catch (error) {
    console.error('Error setting new password:', error);
    res.status(500).send('Server Error');
  }
}


