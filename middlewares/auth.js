// check for authenticated user or not

const jwt = require('jsonwebtoken');
require('dotenv').config();

// authetication

exports.auth = (req, res, next) => {
    try {
        // console.log(req.body);
        // extract jwt token -> header is more secure 
        // in header -> key = Authorization, value = Bearer

        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization").replace("Bearer ",""));


        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        if(!token || token == undefined){
            return res.status(401).json({
                success: false,
                message: 'token missing'
            })
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                message: 'token is invalid'
            })
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'something went wrong while verifying the token'
        })
    }
}

// authorization

exports.isStudent = (req, res, next) => {
    try {
        if(req.user.role !== "Student"){
            return res.status(500).json({
                success: false,
                message: 'this is a protected route for students'
            })
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'user role is not matching'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(500).json({
                success: false,
                message: 'this is a protected route for admin'
            })
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'user role is not matching'
        })
    }
}