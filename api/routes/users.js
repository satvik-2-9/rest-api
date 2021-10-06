const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');


/* the idea of salting in password authentication is that 
   if the password is weak and maybe someone could figure out thr 
   plain text password from the hash if they got access to database using 
   dictionary tables etc. Hence we add random strings to the password and 
   then store the hash of the resulting string.
*/

router.post('/signup', (req, res, next) => {
                    /* 10 salting rounds */
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length>=1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created'
                                })
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
        }
    })
    
})


router.delete('/:userID', (req, res, next) => {
    User.deleteOne({ _id: req.params.userID })
        .exec()
        .then(result=> {
            res.status(200).json({
                message:'User deleted'
            })
        }).catch(e => {
            console.log(e);
            res.status(500).json({
                error:e
            })
        });
})

module.exports = router; 