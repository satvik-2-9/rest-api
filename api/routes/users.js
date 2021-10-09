const express = require("express");
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');
/* the idea of salting in password authentication is that 
   if the password is weak and maybe someone could figure out thr 
   plain text password from the hash if they got access to database using 
   dictionary tables etc. Hence we add random strings to the password and 
   then store the hash of the resulting string.
*/

router.post('/signup', UsersController.users_signup);
router.post('/login', UsersController.users_login);
router.delete('/:userID',checkAuth,UsersController.users_delete);

module.exports = router; 