const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../controller/auth');


router.post('/', (req, res) => {
    const {
     
        email,
        password
    } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            msg: 'Please enter all fields'
        });
    }

    // Check exisiting user
    User.findOne({
        email
    }).then(user => {
        if (!user) return res.status(400).json({
            msg: "User does not exists"
        });
        
        // Validate Password
        bcrypt.compare(password, user.password)
            .then(isMatch=>{
                if(!isMatch) return res.status(400).json({msg: "Invalid Crendentials"});

                jwt.sign(
                    {id: user.id},
                    config.get('jwtSecret'),
                    { expiresIn: 3600},
                    (err, token)=>{
                        if(err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,

                            }
                        })

                    }
                )
            })
      
    })

});

router.get('/user', auth, (req, res)=>{
    User.findById(req.user.id)
        .select('-passowrd')
        .then(user=>res.json(user));
} )

module.exports = router;