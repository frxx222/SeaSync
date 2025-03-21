// import mongoose from "mongoose";

// export const ApplicationSchema = new mongoose.Schema({
//     adminRole: {
//         type: String,
//         enum: ["BFAR", "Boac", "Mogpog", "Gasan", "Buenavista", "Torrijos", "Sta Cruz"],
//         required: true
//     },
//     applicationData: {
//         type: Object,
//         required: true
//     },
// });


// export default mongoose.model.Application || mongoose.model('Application', ApplicationSchema)

import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    adminRole: {
        type: String,
        enum: ["BFAR", "Boac", "Mogpog", "Gasan", "Buenavista", "Torrijos", "Sta Cruz"],
        required: true,
        validate: {
            validator: function(value) {
                // If it's not BFAR, it must match the user's username for LGU
                if (value !== "BFAR") {
                    return this.createdBy === value; // Assuming you add createdBy field
                }
                return true;
            },
            message: 'LGU users can only create applications for their own municipality'
        }
    },
    applicationData: {
        type: Object,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});

export default mongoose.model.Application || mongoose.model('Application', ApplicationSchema);