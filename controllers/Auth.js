const bcrypt = require('bcrypt');
const User = require('../model/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');

//retry strategy kaise laagye ki 3 baar kosish kre hash krne ki agar ni kr paya to error dedega

// signup rute handler
exports.signup = async (req, res) => {
    try {
        // console.log(req.body);
        
        //get data
        const { name, email, password, role } = req.body;

        //check if user already exist
        const exitingUser = await User.findOne({email});

        if(exitingUser){
            return res.status(400).json({
                success: false,
                message: 'user already exist'
            });
        }

        // secure password
        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'error in hasing password'
            })
        }

        //  create entry for user
        const user = await User.create({
            name, email, password:hashPassword, role
        })

        return res.status(200).json({
            success: true,
            message: "user created successfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "user cannot be registered, please try again later"
        })
    }
}

exports.login = async (req, res) => {
    try {
        // console.log(req.body);

        //get data
        const { email, password, role } = req.body;

        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "please fill all the details"
            });
        }

        //check for registered user
        let user = await User.findOne({email});
        // console.log(user);

        if(!user){
            return res.status(401).json({
                success: false,
                message: 'user is not registered'
            });
        }

        // create payload for jwt
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        // very password and generate JWT token
        if(await bcrypt.compare(password, user.password)){
            // password match -> login
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h'});

            // to add in user data locally
            user = user.toObject();
            user.token = token;

            // remove password from user object not database, so that if there is any hacker they cannot see password
            user.password = undefined;

            // console.log(user);

            // create cookie -> expire in 30 seconds
            const options = {
                expires: new Date(Date.now() + 30000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in successfully"
            })

            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "user logged in successfully"
            // })
        }
        else{
            return res.status(403).json({
                success: false,
                message: "password incorrect"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "login failure"
        })
    }
}
