const router = require('express').Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
let User = require('../models/user.model');

const validationUserSignup = [
    check('username','Enter a valid username').notEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password').isLength({
        min:6
    })
];

const validationSignin = [
    check('email', 'Enter a valid email').isEmail(),
    check('password').isLength({
        min:6
    })
];


router.route('/signup').post( validationUserSignup ,async ( req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    
    try {
        let userExists = await User.findOne({username:req.body.username});
        let emailExists = await User.findOne({email:req.body.email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        if(emailExists){
            return res.status(400).json({message:"Email already exists"});
        }

        const salt = await bcrypt.genSalt(5);
        const bcryptPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcryptPassword
        });

       const newUser = await user.save();
       res.status(201).json(newUser);
        
    } catch (error) {
        res.status(400).json(error);
    }

});

router.route('/signin').post( validationSignin, async (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        });
    }

    const { email, password } = req.body;
    try {

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: 'User doesnt exist.'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Password incorrect.'
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: 60
            },
            (error, token) => {
                if(error){
                    throw error
                }
                res.status(200).json({
                    token
                })
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error.'
        })
    }

});

router.route('/signout').delete()
module.exports = router;