const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },


})
// This method generates an authentication token for the user.
// It uses the user's _id and a secret key from the environment variables to create a JWT token.
// The token is set to expire in 24 hours.
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

// Hashes the user's password using bcrypt with a salt rounds value of 10
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

// Compares the provided password with the stored hashed password
// Returns a boolean indicating if the passwords match
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('user' , userSchema)
module.exports = userModel;  


// we have to add socket int this 