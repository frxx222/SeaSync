// import mongoose from "mongoose";

// export const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, "Please provide username"],
//         unique: [true, "Username exist"]
//     },
//     password: {
//         type: String,
//         required: [true, "Please provide password"],
//         unique: false,
//     },
//     email: {
//         type: String,
//         required: [true, "Please provide unique Email"],
//         unique: true,
//     },
    
// })

// export default mongoose.model.Users || mongoose.model('User', UserSchema)

// import mongoose from "mongoose";

// export const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, "Please provide a username"],
//         unique: [true, "Username exists"]
//     },
//     password: {
//         type: String,
//         required: [true, "Please provide a password"]
//     }
// });

// export default mongoose.model.Users || mongoose.model('User', UserSchema);

import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    role: {
        type: String,
        enum: ['LGU', 'BFAR'], // Define allowed roles
        default: 'BFAR' 
    },
    securityQuestion: {
        type: String,
        // optional – set when registering or later updated by the user
      },
      securityAnswer: {
        type: String,
        // optional – if provided, it should be stored in a hashed form
      }
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);
