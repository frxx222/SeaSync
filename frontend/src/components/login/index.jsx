// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import bgImage from '../../images/bg.jpg';
// import { Toaster } from 'react-hot-toast';
// import { toast } from 'react-hot-toast';
// import { useFormik } from 'formik';
// import { usernameValidate } from '../../states/validate';
// import { useAuthStore } from '../../store/store';
// import { verifyPassword } from '../../states/api';

// import './login.css';

// function Login() {
//   const navigate = useNavigate();
//   const setUsername = useAuthStore((state) => state.setUsername);
//   const [showPassword, setShowPassword] = useState(false);

//   // Using Formik for form handling
//   const formik = useFormik({
//     initialValues: {
//       username: '',
//       password: '',
//     },
//     validate: usernameValidate,
//     validateOnBlur: false,
//     validateOnChange: false,
//     onSubmit: async (values) => {
//       setUsername(values.username); // Save the username in the store

//       try {
//         const { data } = await verifyPassword({
//           username: values.username,
//           password: values.password,
//         });

//         console.log('Login successful:', data);
//         navigate('/dashboard');
//       } catch (error) {
//         toast.error(error?.response?.data?.error || 'Invalid credentials');
//       }
//     },
//   });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleForgotPasswordClick = (e) => {
//     if (!formik.values.username) {
//       e.preventDefault(); // Prevent navigation
//       toast.error('Please enter your username before resetting the password.');
//     } else {
//       // Store the username for the reset process, if required
//       setUsername(formik.values.username);
//     }
//   };

//   return (
//     <section className="Home">
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="content">
//         <h2>SEAsync.</h2>
//         <p>Integrated Aquatic and Resource Monitoring System</p>
//       </div>

//       <div className="login">
//         <h2>Log in</h2>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="input-box">
//             <span className="icon">
//               <i className="fas fa-user"></i>
//             </span>
//             <input
//               type="text"
//               name="username"
//               placeholder=""
//               {...formik.getFieldProps('username')}
//               required
//             />
//             <label className="floating-label">Enter Username</label>
//             {formik.touched.username && formik.errors.username ? (
//               <div className="error">{formik.errors.username}</div>
//             ) : null}
//           </div>

//           <div className="input-box">
//             <span className="icon">
//               <i className="fas fa-lock"></i>
//             </span>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               placeholder="Enter your password"
//               {...formik.getFieldProps('password')}
//               required
//             />
//             <label className="floating-label">Enter password</label>
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
//             {formik.touched.password && formik.errors.password ? (
//               <div className="error">{formik.errors.password}</div>
//             ) : null}
//           </div>

//           <div className="forgot-remember">
//             <p>
//               <Link
//                 to="/reset"
//                 onClick={handleForgotPasswordClick} // Attach the click handler
//                 style={{
//                   color: !formik.values.username ? 'gray' : '',
//                   pointerEvents: !formik.values.username ? 'none' : 'auto',
//                 }}
//               >
//                 Forgot Password
//               </Link>
//             </p>
//           </div>

//           <button type="submit" className="btn">
//             Log in
//           </button>

//           <div className="register-link">
//             <p>
//               Not yet registered? <Link to="/register">Register</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../../images/bg.jpg';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../../states/validate';
import { useAuthStore } from '../../store/store';
import { verifyPassword } from '../../states/api';

import './login.css';

function Login() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);
  const setRole = useAuthStore((state) => state.setRole); // Store role
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username); // Save the username in the store

      try {
        const { data } = await verifyPassword({
          username: values.username,
          password: values.password,
        });

        // Save the role in the store or use it directly
        setRole(data.role);
        console.log('Login successful:', data);

        navigate('/dashboard');
      } catch (error) {
        toast.error(error?.response?.data?.error || 'Invalid credentials');
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    const handleForgotPasswordClick = (e) => {
    if (!formik.values.username) {
      e.preventDefault(); // Prevent navigation
      toast.error('Please enter your username before resetting the password.');
    } else {
      // Store the username for the reset process, if required
      setUsername(formik.values.username);
    }
  };

  return (
    <section className="Home">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="content">
        <h2>SEAsync.</h2>
        <p>Integrated Aquatic and Resource Monitoring System</p>
      </div>

      <div className="login">
        <h2>Log in</h2>
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

          <div className="input-box">
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter Password"
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

          <div className="forgot-remember">
            <p>
               <Link
                to="/reset"
                onClick={handleForgotPasswordClick} // Attach the click handler
                style={{
                  color: !formik.values.username ? 'gray' : '',
                  pointerEvents: !formik.values.username ? 'none' : 'auto',
                }}
              >
                Forgot Password
              </Link>
            </p>
          </div>

          <button type="submit" className="btn">Log in</button>

          <div className="register-link">
            <p>Not yet registered? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
