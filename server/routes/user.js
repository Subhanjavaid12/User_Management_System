import express from 'express';
import { view, edit, update, deleteUser, loginPage, getProfile,
  logout, resetPassword,checkEmail} from '../controllers/userController.js';
import { registerUser, loginUser, checkSession,noCache,  checkPermission } from '../services/auth.js';

const router = express.Router();

router.get('/', loginPage);



router.get('/register', (req, res) => {
  res.render('add-user');
});


// FORM SUBMISSION ROUTES 

router.post('/login', loginUser);
router.post('/register', registerUser);



//  PROTECTED ROUTES 

router.get('/home', checkSession, noCache, view);
router.get('/profile', checkSession, getProfile);



//  ADMIN ONLY ROUTES 

router.get('/edituser/:id', checkSession,  checkPermission(['admin']), edit);
router.post('/edituser/:id', checkSession, checkPermission(['admin']), update);
router.delete('/deleteuser/:id', checkSession,  checkPermission(['admin']), deleteUser);

//  LOGOUT ROUTE 

router.post('/logout',checkSession, logout);


// Reset Password
router.get('/resetPassword', resetPassword);

// Is entered email is vaild or not
router.get('/newPassword/:id', checkEmail)

export default router;
