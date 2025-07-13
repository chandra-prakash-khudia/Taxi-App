const { validationResult } = require('express-validator');
const userModel = require('../models/user.model.js');
const userService = require('../services/user.service.js');
const blackListTokenModel = require('../models/blacklistToken.model.js');
module.exports.registerUser = async (req, res, next) => {

    // Checks for validation errors in the request and returns a 400 status with the errors if any are found
    // console.log("Request Body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;

     const isUserAlready = await userModel.findOne({email});
     if(isUserAlready){
        return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await userModel.hashPassword(password)
        // Creates a new user with the provided details and hashed password

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });
        // Generates an authentication token for the newly created user

    const token = user.generateAuthToken()

    // Sends a 201 status response with the generated token and user details
    res.status(201).json({token,user});
}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out' });

}