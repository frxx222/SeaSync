import UserModel from "../models/User.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

// export async function updateAllLGUSecurityFields() {
//     try {
//         // Define questions and answers for each LGU
//         const lguData = {
//             'Boac': {
//                 question: 'Which barangay in Boac has the largest fishing community?',
//                 answer: 'Laylay'  // Example answer
//             },
//             'Mogpog': {
//                 question: 'What is the main fish product in Mogpog?',
//                 answer: 'Bangus'  // Example answer
//             },
//             'Gasan': {
//                 question: 'What is the main fishing method in Gasan?',
//                 answer: 'Net Fishing'  // Example answer
//             },
//             'Buenavista': {
//                 question: 'Which month has the highest fish catch in Buenavista?',
//                 answer: 'December'  // Example answer
//             },
//             'Torrijos': {
//                 question: 'What is the primary fishing season in Torrijos?',
//                 answer: 'Summer'  // Example answer
//             },
//             'StaCruz': {
//                 question: 'What is the main aquaculture product in Sta Cruz?',
//                 answer: 'Tilapia'  // Example answer
//             }
//         };

//         for (const [username, data] of Object.entries(lguData)) {
//             // Hash the specific answer for each municipality
//             const hashedAnswer = await bcrypt.hash(data.answer, 10);

//             // Update each user
//             const updatedUser = await UserModel.findOneAndUpdate(
//                 { username },
//                 { 
//                     $set: { 
//                         securityQuestion: data.question,
//                         securityAnswer: hashedAnswer
//                     }
//                 },
//                 { new: true }
//             );

//             if (updatedUser) {
//                 console.log(`Updated ${username}:`, updatedUser);
//             } else {
//                 console.log(`User ${username} not found!`);
//             }
//         }

//         console.log("All updates completed!");
//     } catch (error) {
//         console.error("Error updating users:", error);
//     }
// }
// updateAllLGUSecurityFields();
//middleware for verify user
export async function verifyUser(req, res, next) {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        //check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error: "Can't find user!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}

// export async function register(req, res) {
//     try {
//         const { username, password, role } = req.body;
//         console.log("Received registration request:", { username, role });

//         // Validate LGU usernames
//         const validLGUs = ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'StaCruz'];
//         if (role === 'LGU' && !validLGUs.includes(username)) {
//             return res.status(400).json({ 
//                 error: "For LGU roles, username must be one of: Boac, Mogpog, Gasan, Buenavista, Torrijos, or Sta Cruz" 
//             });
//         }

//         // Check for existing username
//         const existingUser = await UserModel.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ error: "Username already exists" });
//         }

//         if (password) {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newUser = new UserModel({
//                 username,
//                 password: hashedPassword,
//                 role
//             });
//             await newUser.save();
//             return res.status(201).json({ msg: "User registered successfully" });
//         } else {
//             return res.status(400).json({ error: "Password is required" });
//         }
//     } catch (error) {
//         console.error("Registration error:", error);
//         return res.status(500).json({ 
//             error: error.message || "Internal server error" 
//         });
//     }
// }

export async function register(req, res) {
    try {
      const { username, password, role, securityQuestion, securityAnswer } = req.body;
      console.log("Received registration request:", { username, role });
  
      // Validate LGU usernames
      const validLGUs = ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'StaCruz'];
      if (role === 'LGU' && !validLGUs.includes(username)) {
        return res.status(400).json({ 
          error: "For LGU roles, username must be one of: Boac, Mogpog, Gasan, Buenavista, Torrijos, or Sta Cruz" 
        });
      }
  
      // Check for existing username
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
  
      if (password) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // If a security answer is provided, hash it as well
        let hashedSecurityAnswer;
        if (securityAnswer) {
          hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);
        }
  
        const newUser = new UserModel({
          username,
          password: hashedPassword,
          role,
          securityQuestion: securityQuestion,      // may be undefined if not provided
          securityAnswer: hashedSecurityAnswer       // may be undefined if not provided
        });
        await newUser.save();
        return res.status(201).json({ msg: "User registered successfully" });
      } else {
        return res.status(400).json({ error: "Password is required" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
  
  // ----------------------
  // Retrieve Security Question
  // ----------------------
  export async function getSecurityQuestion(req, res) {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!user.securityQuestion) {
        return res.status(404).json({ error: "Security question not set for this user" });
      }
      return res.status(200).json({ securityQuestion: user.securityQuestion });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  // ----------------------
  // Reset Password with Security Question
  // ----------------------
  export async function resetPasswordWithSecurityQuestion(req, res) {
    try {
      const { username, securityAnswer, newPassword } = req.body;
      if (!username || !securityAnswer || !newPassword) {
        return res.status(400).json({ error: "Username, security answer, and new password are required" });
      }
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!user.securityAnswer) {
        return res.status(400).json({ error: "Security answer not set for this user" });
      }
      // Compare the provided answer with the stored (hashed) answer
      const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.securityAnswer);
      if (!isAnswerCorrect) {
        return res.status(401).json({ error: "Security answer is incorrect" });
      }
      // Hash the new password and update the user
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
      return res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
// }
// In userController.js - Update the login function
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: "Invalid password" });
        }

        // Create JWT token with _id instead of userId
        const token = jwt.sign({
            _id: user._id,  // Changed from userId to _id
            username: user.username,
            role: user.role
        }, ENV.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({
            msg: "Login successful",
            username: user.username,
            role: user.role,
            token
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
// export async function login(req, res) {
//     const { username, password } = req.body;

//     try {
//         UserModel.findOne({ username })
//             .then(user => {
//                 bcrypt.compare(password, user.password)
//                     .then(passwordCheck => {
//                         if (!passwordCheck) return res.status(400).send({ error: "Invalid password" });

//                         // Create JWT token with role
//                         const token = jwt.sign({
//                             userId: user._id,
//                             username: user.username,
//                             role: user.role // Include role in the token
//                         }, ENV.JWT_SECRET, { expiresIn: "24h" });

//                         return res.status(200).send({
//                             msg: "Login successful",
//                             username: user.username,
//                             role: user.role, // Send role back to the frontend
//                             token
//                         });
//                     })
//                     .catch(error => {
//                         return res.status(400).send({ error: "Invalid password" });
//                     });
//             })
//             .catch(error => {
//                 return res.status(404).send({ error: "Username not found" });
//             });
//     } catch (error) {
//         return res.status(500).send({ error });
//     }
// }


export async function getUser(req, res) {
    const { username } = req.params;

    // console.log("Received request for username:", username); // Debugging line

    try {
        if (!username) {
            console.log("Invalid username provided");
            return res.status(400).send({ error: "Invalid username" });
        }

        const user = await UserModel.findOne({ username });
        
        if (!user) {
            // console.log("No user found with the username:", username);
            return res.status(404).send({ error: "Couldn't find the user" });
        }
        //remove password from the user
        const { password, ...rest } = Object.assign({}, user.toJSON());

        // console.log("User found:", user);
        return res.status(200).send(rest);
        
    } catch (error) {
        // console.log("Unexpected error:", error);
        return res.status(500).send({ error: "Cannot get user data" });
    }
}


// export async function updateUser(req, res) {
//     try {
//         // const id = req.query.id;
//         const { userId } = req.user;

//         if (userId) {
//             const body = req.body;

//             // Use async/await instead of callbacks
//             const result = await UserModel.updateOne({ _id: userId }, body);

//             if (result.nModified === 0) {
//                 return res.status(404).send({ error: "User not found or no changes made" });
//             }

//             return res.status(200).send({ msg: "Record updated successfully!" });

//         } else {
//             return res.status(400).send({ error: "User ID is required" });
//         }

//     } catch (error) {
//         console.error("Error updating user:", error); // Add logging for debugging
//         return res.status(500).send({ error: "Failed to update user" });
//     }
// }
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        const body = req.body;

        if (userId) {
            const result = await UserModel.updateOne({ _id: userId }, body);

            if (result.nModified === 0) {
                return res.status(404).send({ error: "User not found or no changes made" });
            }

            return res.status(200).send({ msg: "Record updated successfully!" });
        } else {
            return res.status(400).send({ error: "User ID is required" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send({ error: "Failed to update user" });
    }
}



export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP})
}

export async function verifyOTP(req, res) {
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null //reset otp value
        req.app.locals.resetSession = true //start session for reset password
        return res.status(201).send({ message: 'verify succefully!'})
    }
    return res.status(400).send({ error: "Invalid OTP!"})
}

export async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false
        return res.status(201).send({ msg: "access granted"})
    }
    return res.status(440).send({ msg: "session expires!"})
}

export async function resetPassword(req, res) {
    try {

        if(!req.app.locals.resetSession) return res.status(440).send({ msg: "session expires!"})

        const { username, password } = req.body;

        try {
            UserModel.findOne({ username })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ error: "Username not found!" });
                }
                bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    UserModel.updateOne({ username: user.username },
                        { password: hashedPassword }, function (err, data) {
                            if (err) throw err;
                            return res.status(201).send({ msg: "Record Updated!" });
                        });
                })
                .catch(e => {
                    return res.status(500).send({
                        error: "Unable to hash password"
                    });
                });
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not found!" });
            });
        } catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }

    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
}

export async function getApplications(req, res) {
    try {
        const { role, username } = req.user; // Get both role and username from token

        let query = {};
        if (role === 'LGU') {
            // If LGU, only show their specific data
            query.assignedLGU = username; // Assuming you have an assignedLGU field
        }
        // BFAR users can see all data (no query filter)

        const applications = await ApplicationModel.find(query);
        return res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
}
