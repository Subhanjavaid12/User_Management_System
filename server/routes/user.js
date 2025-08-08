import express from 'express';
import { view, edit, update, deleteUser, loginPage, getProfile,
  logout, resetPassword, CheckEmail,simpleSetNewPassword} from '../controllers/userController.js';
import { registerUser, loginUser, checkSession,noCache,
    checkPermission} from '../services/auth.js';

const router = express.Router();

// Login 
router.get('/', loginPage);
router.post('/login', loginUser);


// FORM SUBMISSION ROUTES 


router.post('/register', registerUser);
router.get('/register', (req, res) => {
  res.render('add-user');
});


//  PROTECTED ROUTES 

router.get('/home', checkSession, noCache, view);
router.get('/profile', checkSession, getProfile);


//  ADMIN ONLY ROUTES 

router.get('/edituser/:id', checkSession,  checkPermission(['admin']), edit);
router.post('/edituser/:id', checkSession, checkPermission(['admin']), update);
router.delete('/deleteuser/:id', checkSession,  checkPermission(['admin']), deleteUser);

//  LOGOUT ROUTE 

router.get('/log', logout);


// Reset Password
router.get('/resetPassword', resetPassword);


// Is entered email is vaild or not
router.post('/newPassword', CheckEmail);

router.get('/new-password/:id', (req, res) => {
  const userId = req.params.id
  res.render('new-password', { id: userId });
});


// New password
router.get('/new-password/:id', (req, res) => {
  const userId = req.params.id
  res.render('new-password', { id: userId });
});

router.post('/new-password/:id', simpleSetNewPassword);

export default router;
