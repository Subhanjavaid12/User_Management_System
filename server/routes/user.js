import express from 'express';
import { view, edit, update, deleteUser, loginPage, getProfile,
  logout, resetPassword, handleForgotPasswordRequest,showResetPasswordForm,
  handleResetPasswordSubmission,checkEmail} from '../controllers/userController.js';
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
router.post('/newPassword', checkEmail);

router.get('/new-password/:id', (req, res) => {
  const userId = req.params.id
  res.render('new-password', { id: userId });
});


// New password
// router.get('/new-password/:id', (req, res) => {
//   const userId = req.params.id
//   res.render('new-password', { id: userId });
// });

// router.post('/new-password/:id', simpleSetNewPassword);

// router.post('/newPassword', CheckEmail);


// --- FORGOT PASSWORD WORKFLOW ---

// Route to DISPLAY the initial form where the user enters their email.
// This renders your 'reset-password.hbs' file.
router.get('/new-password', (req, res) => {
  res.render('new-password', { message: null });
});

router.post('/reset-password', handleForgotPasswordRequest);
router.get('/new-password/:token', showResetPasswordForm);
router.post('/new-password/:token', handleResetPasswordSubmission);



export default router;




