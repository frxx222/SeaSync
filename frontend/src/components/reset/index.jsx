// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import toast, { Toaster } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { resetPasswordValidation } from '../../states/validate';
// import { resetPassword } from '../../states/api';
// import { useAuthStore } from '../../store/store';
// import './reset.css'; // CSS file

// export default function Reset() {
//     const navigate = useNavigate();
//     const { username } = useAuthStore((state) => state.auth);

//     // State for toggling password visibility
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const togglePasswordVisibility = () => setShowPassword(!showPassword);
//     const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

//     const formik = useFormik({
//         initialValues: {
//             password: '',
//             confirm_pwd: '',
//         },
//         validate: resetPasswordValidation,
//         validateOnBlur: false,
//         validateOnChange: false,
//         onSubmit: async (values) => {
//             const resetPromise = resetPassword({ username, password: values.password });

//             toast.promise(resetPromise, {
//                 loading: 'Updating...',
//                 success: <b>Password Reset Successfully!</b>,
//                 error: (err) => err.response?.data?.message || "Could not reset password!",
//             });

//             resetPromise.then(() => navigate('/login'));
//         },
//     });
//     console.log(username);
//     return (
//         <section className="reset-container">
//             <Toaster position="top-center" reverseOrder={false} />
//             <div className="reset-card">
//                 <h2 className="reset-title">Reset Password</h2>
//                 <form onSubmit={formik.handleSubmit}>
//                 <div className="reset-input-box">
//                 <span className="reset-input-icon">
//                     <i className="ion-md-lock"></i>
//                 </span>
//                 <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     placeholder="New Password"
//                     {...formik.getFieldProps('password')}
//                     required
//                 />
//                 <span
//                     onClick={togglePasswordVisibility}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => e.key === 'Enter' && togglePasswordVisibility()}
//                     style={{
//                         position: 'absolute',
//                         right: '20px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         cursor: 'pointer',
//                         color: 'white',
//                     }}
//                 >
//                     {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
//                 </span>

//                 {formik.touched.password && formik.errors.password ? (
//                     <div className="reset-error">{formik.errors.password}</div>
//                 ) : null}
//             </div>

//             {/* Confirm Password Input */}
//             <div className="reset-input-box">
//                 <span className="reset-input-icon">
//                     <i className="ion-md-lock"></i>
//                 </span>
//                 <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     name="confirm_pwd"
//                     placeholder="Repeat Password"
//                     {...formik.getFieldProps('confirm_pwd')}
//                     required
//                 />
//                 <span
//                     onClick={toggleConfirmPasswordVisibility}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => e.key === 'Enter' && toggleConfirmPasswordVisibility()}
//                     style={{
//                         position: 'absolute',
//                         right: '20px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         cursor: 'pointer',
//                         color: 'white',
//                     }}
//                 >
//                     {showConfirmPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
//                 </span>
//                 <div style={{ color: '#F6F5F5', position: 'absolute' }}>
//                 password must have special character
//                 </div>
//                 {formik.touched.confirm_pwd && formik.errors.confirm_pwd ? (
//                     <div className="reset-error">{formik.errors.confirm_pwd}</div>
//                 ) : null}
//             </div>

//                     {/* Submit Button */}
//                     <button type="submit" className="reset-submit-button">
//                         Reset Password
//                     </button>
//                 </form>
//             </div>
//         </section>
//     );
// }
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { getSecurityQuestion, resetPasswordSecurity } from '../../states/api';

import './reset.css'; // optional: add your own styling

function ResetPassword() {
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [step, setStep] = useState(1); // step 1: get question; step 2: answer & reset
  const navigate = useNavigate();

  // Step 1: Retrieve security question for a given username
  const handleGetQuestion = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username.');
      return;
    }
    try {
      const data = await getSecurityQuestion(username);
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
    } catch (error) {
      toast.error(error.error || 'Failed to get security question.');
    }
  };

  // Step 2: Use Formik for answer, new password, and confirm password
  const formik = useFormik({
    initialValues: {
      securityAnswer: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      if (values.newPassword !== values.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      try {
        await resetPasswordSecurity({
          username,
          securityAnswer: values.securityAnswer,
          newPassword: values.newPassword,
        });
        toast.success('Password reset successfully.');
        // Optionally navigate to the login page after success
        navigate('/login');
      } catch (error) {
        toast.error(error.error || 'Error resetting password.');
      }
    },
  });

  return (
    <div className="reset-password-container">
      <Toaster position="top-center" reverseOrder={false} />
      {step === 1 && (
        <form onSubmit={handleGetQuestion} className="form-container">
          <h2>Reset Password</h2>
          <div className="input-group">
            <label htmlFor="username">Enter Your Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Get Security Question
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={formik.handleSubmit} className="form-container">
          <h2>Answer Security Question</h2>
          <p className="security-question">{securityQuestion}</p>
          <div className="input-group">
            <label htmlFor="securityAnswer">Security Answer</label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              onChange={formik.handleChange}
              value={formik.values.securityAnswer}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"    
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              required
            />
          </div>
          <button type="submit" className="btn">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
