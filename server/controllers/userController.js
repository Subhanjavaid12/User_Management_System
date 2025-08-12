import pool from '../../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';
import bcrypt from 'bcryptjs';

import crypto from 'crypto'; 
import { sendEmail } from '../utils/emailSender.js'; 



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
// export const CheckEmail = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const [rows] = await pool.query('SELECT id FROM system WHERE email = ?', [email]);
//     const user = rows[0];
//     console.log([rows])
//     if (user) {
//       res.redirect(`/new-password/${user.id}`);
//     } else {
      
//       res.render('reset-password', {
//         error: 'No account found with that email address.'
//       });
//     }
//   } catch (error) {
//     console.error('Error in CheckEmail:', error);
//     res.status(500).send('Server Error');
//   }
// };
// // To Change Password
// export const simpleSetNewPassword = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { password, confirmPassword } = req.body;
//     if (password !== confirmPassword) {
//       return res.render('new-password', {
//         error: 'Passwords do not match.',
//         UserId: id 
//       });
//     }
//     const newHashedPassword = await bcrypt.hash(password, 10);
//     await pool.query('UPDATE system SET password = ? WHERE id = ?', [newHashedPassword, id]);
//     res.redirect('/');

//   } catch (error) {
//     console.error('Error setting new password:', error);
//     res.status(500).send('Server Error');
//   }
// }


export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
       const [rows] = await pool.query('SELECT id FROM system WHERE email = ?', [email]);
    const user = rows[0];

       if (user) {
           res.redirect(`/new-password/${user.id}`);
    } else {
     
      res.render('reset-password', {
        error: 'Invalid email. No account found with that address.'
      });
    }
  } catch (error) {
    console.error('Error in CheckEmail:', error);
    res.status(500).send('Server Error');
  }
};






export const handleForgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT * FROM system WHERE email = ?', [email]);
    const user = rows[0];

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expirationDate = new Date(Date.now() + 15 * 60 * 1000);
      
      await pool.query(
        'UPDATE system SET resetPassword = ?, resetExpires = ? WHERE id = ?',
        [hashedToken, expirationDate, user.id]
      );

     
      const yesLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
      const noLink = `${req.protocol}://${req.get('host')}/login`;

      const message = `Hello ${user.first_name},\n\nWe received a request to reset the password for your account. Are you sure you want to proceed?\n\nClick YES to continue:\n${yesLink}\n\nClick NO to cancel:\n${noLink}\n\nThis link is valid for 15 minutes. If you did not request this, please ignore this email.`;

      await sendEmail({
        email: user.email,
        subject: 'Confirm Your Password Reset Request',
        message: message,
      });
    }


    res.render('reset-password', {
      message: 'If an account with that email exists, a confirmation link has been sent.'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    
    res.render('reset-password', {
      message: 'If an account with that email exists, a confirmation link has been sent.'
    });
  }
};

export const showResetPasswordForm = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const query = 'SELECT id FROM system WHERE resetPassword = ? AND resetExpires > NOW()';
    const [rows] = await pool.query(query, [hashedToken]);
    const user = rows[0];

    if (!user) {
      return res.render('message', { title: 'Link Expired', message: 'This password reset link is invalid or has expired.' });
    }

    res.render('new-password', { token: token, error: null });

  } catch (error) {
    console.error('Show Reset Form Error:', error);
    res.status(500).send('Server Error');
  }
};


export const handleResetPasswordSubmission = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const query = 'SELECT id FROM system WHERE resetPassword = ? AND resetExpires > NOW()';
    const [rows] = await pool.query(query, [hashedToken]);
    const user = rows[0];

    if (!user) {
      return res.render('message', { title: 'Link Expired', message: 'This password reset link is invalid or has expired.' });
    }

    if (password !== confirmPassword) {
      return res.render('new-password', {
        token: token,
        error: 'Passwords do not match.'
      });
    }

    const newHashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      'UPDATE system SET password = ?, resetPassword = NULL, resetExpires = NULL WHERE id = ?',
      [newHashedPassword, user.id]
    );

    res.redirect('/login?message=Password has been reset successfully.');

  } catch (error) {
    console.error('Handle Reset Password Submission Error:', error);
    res.status(500).send('Server Error');
  }
};
