const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating Schema ~ getting user info to display on profiles
const UserSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    firstName: {
        type: String
    }, 
    lastName: {
        type: String
    },
    image: {
        type: String
    }
});

// Create collections and add schema to mongoose
mongoose.model('users', UserSchema);