import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../../states/validate';
import { registerUser } from '../../states/api';
import bgImage from '../../images/bg.jpg';

import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      role: 'LGU', // Default role
      // New fields for security question & answer
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: '',
    },
    validate: registerValidation, // Ensure your validation function covers the new fields if needed
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const registerPromise = registerUser(values);

      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Registration Successful!</b>,
        error: <b>Could not Register. Please try again.</b>,
      });

      registerPromise.then(() => navigate('/login'));
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="Home">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="content">
        <h2>SEAsync.</h2>
        <p>Integrated Aquatic and Resource Monitoring System</p>
      </div>

      <div className="login">
        <h2>Register</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-box">
            <span className="icon">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              {...formik.getFieldProps('username')}
              required
            />
            <label className="floating-label">Enter Username</label>
          </div>

          <div className="input-box" style={{ position: 'relative' }}>
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter password"
              {...formik.getFieldProps('password')}
              required
            />
            <label className="floating-label">Enter Password</label>
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              {showPassword ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </span>
          </div>

          {/* Role Selection */}
          <div className="input-box">
            <label className="role-label">Select Role</label>
            <div className="custom-select-wrapper">
              <select
                name="role"
                className="custom-select"
                {...formik.getFieldProps('role')}
                required
              >
                <option value="LGU">LGU</option>
                <option value="BFAR">BFAR</option>
              </select>
            </div>
          </div>

          {/* Security Question Selection */}
          <div className="input-box">
            <label className="security-question-label">
              Select a Security Question
            </label>
            <div className="custom-select-wrapper">
              <select
                name="securityQuestion"
                className="custom-select"
                {...formik.getFieldProps('securityQuestion')}
                required
              >
                <option value="What is your mother's maiden name?">
                  What is your mother's maiden name?
                </option>
                <option value="What was the name of your first pet?">
                  What was the name of your first pet?
                </option>
                <option value="What is your favorite book?">
                  What is your favorite book?
                </option>
                <option value="What city were you born in?">
                  What city were you born in?
                </option>
                <option value="Which barangay in Boac has the largest fishing community?">
                  Which barangay in Boac has the largest fishing community?
                </option>
                <option value="What is the main fish product in Mogpog?">
                What is the main fish product in Mogpog?
                </option>
                <option value="What is the main fishing method in Gasan?">
                What is the main fishing method in Gasan?
                </option>
                <option value="Which month has the highest fish catch in Buenavista?">
                Which month has the highest fish catch in Buenavista?
                </option>
                <option value="What is the primary fishing season in Torrijos?">
                What is the primary fishing season in Torrijos?
                </option>
                <option value="What is the main aquaculture product in Sta Cruz?">
                What is the main aquaculture product in Sta Cruz?
                </option>
              </select>
            </div>
          </div>

          {/* Security Answer */}
          <div className="input-box">
            <span className="icon">
              <i className="fas fa-key"></i>
            </span>
            <input
              type="text"
              name="securityAnswer"
              placeholder="Enter Security Answer"
              {...formik.getFieldProps('securityAnswer')}
              required
            />
            <label className="floating-label">Enter Security Answer</label>
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        </form>

        <div className="register-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';
// import { useFormik } from 'formik';
// import { registerValidation } from '../../states/validate';
// import { registerUser } from '../../states/api';
// import bgImage from '../../images/bg.jpg';

// import './index.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// function Register() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       username: '',
//       password: '',
//       role: 'LGU', // Default role
//     },
//     validate: registerValidation,
//     validateOnBlur: false,
//     validateOnChange: false,
//     onSubmit: async (values) => {
//       const registerPromise = registerUser(values);

//       toast.promise(registerPromise, {
//         loading: 'Creating...',
//         success: <b>Registration Successful!</b>,
//         error: <b>Could not Register. Please try again.</b>,
//       });

//       registerPromise.then(() => navigate('/login'));
//     },
//   });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <section className="Home">
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="content">
//         <h2>SEAsync.</h2>
//         <p>Integrated Aquatic and Resource Monitoring System</p>
//       </div>

//       <div className="login">
//         <h2>Register</h2>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="input-box">
//             <span className="icon"><i className="fas fa-user"></i></span>
//             <input
//               type="text"
//               name="username"
//               placeholder="Enter Username"
//               {...formik.getFieldProps('username')}
//               required
//             />
//             <label className="floating-label">Enter Username</label>
//           </div>

//           <div className="input-box" style={{ position: 'relative' }}>
//             <span className="icon"><i className="fas fa-lock"></i></span>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               placeholder="Enter password"
//               {...formik.getFieldProps('password')}
//               required
//             />
//             <label className="floating-label">Enter Password</label>
//             <span
//               onClick={togglePasswordVisibility}
//               style={{
//                 position: 'absolute',
//                 right: '20px',
//                 top: '50%',
//                 transform: 'translateY(-50%)',
//                 cursor: 'pointer',
//                 color: 'white',
//               }}
//             >
//               {showPassword ? (
//                 <i className="fas fa-eye-slash"></i>
//               ) : (
//                 <i className="fas fa-eye"></i>
//               )}
//             </span>
//           </div>

//           {/* Role Selection */}
//           <div className="input-box">
//             <label className="role-label">Select Role</label>
//             <div className="custom-select-wrapper">
//               <select
//                 name="role"
//                 className="custom-select"
//                 {...formik.getFieldProps('role')}
//                 required
//               >
//                 <option value="LGU">LGU</option>
//                 <option value="BFAR">BFAR</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" className="btn">Register</button>
//         </form>

//         <div className="register-link">
//           <p>Already have an account? <Link to="/login">Login</Link></p>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Register;
