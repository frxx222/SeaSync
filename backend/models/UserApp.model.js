import mongoose from "mongoose";

const UserAppSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username already exists"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    role: {
        type: String,
        enum: ["Boac", "Gasan", "Mogpog", "Buenavista", "StaCruz", "Torrijos"],
        required: true,
    }
}, { timestamps: true });

// Set a default username based on the role
UserAppSchema.pre('save', function (next) {
    if (!this.username && this.role) {
        this.username = this.role.toLowerCase() + '_' + Date.now(); // Example: boac_1637187365
    }
    next();
});

export default mongoose.models.UserApp || mongoose.model('UserApp', UserAppSchema);
