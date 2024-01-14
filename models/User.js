const mongoose = require('mongoose');

const UserSchema = new  mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now ,
    },
    role: { type: String, 
        enum: ['student', 'faculty', 'admin'], 
        default: 'student' ,
    },
    number: String, 
    faculty: String, 
    gender: String, 
    profileImage: {
        type: String,
        default: '/images/user-profile-svgrepo-com.png' 
      }
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
