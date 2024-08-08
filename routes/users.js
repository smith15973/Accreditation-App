const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo, validateUser, verifyToken } = require('../middleware');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess } = require('../middleware');
const { renderRegister, renderLogin, logout, login, requestPlantAccess, viewMembers, approveOrChangeMemberStatus, removeMember, register, microsoftAuthenticate, renderMicrosoftLogin, searchForUsers, renderResetPassword, renderForgotPassword, sendPasswordResetEmail, resetPassword } = require('../controllers/users');



router.route('/auth/microsoft')
    .get(renderMicrosoftLogin);

// Callback route for Microsoft to redirect to
router.route('/auth/microsoft/callback')
    .get(storeReturnTo, microsoftAuthenticate, login);



router.route('/register')
    .get(renderRegister)
    .post(validateUser, register);

router.route('/login')
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), login);

router.get('/logout', logout);

router.route('/forgotPassword')
    .get(renderForgotPassword)
    .post(sendPasswordResetEmail)

router.route('/resetPassword/:resetToken')
    .get(verifyToken, renderResetPassword)
    .post(verifyToken, resetPassword)

router.route('/manage/search')
    .get(isLoggedIn, searchForUsers)

router.route('/:userID/request/:plantID')
    .put(isLoggedIn, requestPlantAccess)


/************Manage Plant Access Requests****************/
router.route('/manage/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, viewMembers);

router.route('/:userID/manage/:plantID')
    .put(isLoggedIn, isAdmin, getCurrentPlantandInstructions, hasPlantAccess, approveOrChangeMemberStatus)
    .delete(isLoggedIn, isAdmin, getCurrentPlantandInstructions, hasPlantAccess, removeMember);


module.exports = router;