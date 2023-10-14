const express = require('express');
const { model } = require('mongoose');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const jwt_secret = "Thisissecret$"


// Rout 1: Create an User in end point /api/auth/createuser
router.post('/createuser',
    // To Give Condition Validation 
    [body('email', 'Enter a Vaild Email').isEmail(),
    body('password', "Password is Too Short").isLength({ min: 5 }),
    body('name', "Name is Too Short").isLength({ min: 3 }),
    ], async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        // IF an Error is occured in validation return an error an bad request
        if (!errors.isEmpty()) {
            return res.status(400).json({ success,errors: errors.array() });
        }

        try {
            // to check Whether User with this email already exist or not 
            let user = await User.findOne({success,email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "User with this Email Already Exist" });
            }


            // To generate a Secure password 
            const salt = await bcrypt.genSalt(10);
            const securepassword = await bcrypt.hash(req.body.password, salt);

            // To Create an User if email is unique 
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securepassword
            });


            // This is used to Create Auth Token
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, jwt_secret);
            success = true;
            res.json({ success,token: token });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Some Error Occured");
        }
    })


//  Rout 2 :  Authentication of user in end point /api/auth/login 
router.post('/login',
    // To Give Condition Validation 
    [body('email', 'Enter a Vaild Email').isEmail(),
    body('password', "Password cannot be blank").exists(),
    ], async (req, res) => {
        const errors = validationResult(req);
        // IF an Error is occured in validation return an error an bad request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        let success = false;

        try {
            const user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({ success : success,error: "Please Provide Vaild Email" });
            }

            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
                return res.status(400).send({ success : success,error: "Please Provide Vaild Password" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, jwt_secret);
            success = true;
            res.json({success:success, token: token });

        } catch (error) {
            console.error(error);
            return res.status(500).send("Some Error Occured");
        }

    });

    
//  Rout 3 :  Get Logged in user Detials using end point /api/auth/getuser 
router.post('/getuser',fetchuser, async (req, res) => {        
        try {
            const Userid = req.user._id;
            const user = await User.findOne({Userid}).select("-password");
            res.send(user);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Some Error Occured");
        }

        });

        module.exports = router;

