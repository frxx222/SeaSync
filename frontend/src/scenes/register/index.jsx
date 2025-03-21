import { useState } from "react";
import { Link } from "react-router-dom";
import './index.css';
import { registerUser } from '../../states/api.js';  // Import the new function

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser({ name, email, password });
      console.log(result);  // Handle success (e.g., redirect, show success message)
      setSuccess('Registration successful!');
      setError('');
    } catch (err) {
      console.error(err);  // Handle error (e.g., show error message)
      setError('Registration failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <section className="Home">
      <div className="content">
        <h2>SEAsync.</h2>
        <p>Integrated Aquatic and Resource Monitoring System</p>
        <a href="#">Get Started</a>
      </div>

      <div className="login">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>} {/* Display error */}
          {success && <p className="success">{success}</p>} {/* Display success */}
          <div className="input-box">
            <span className="icon"><i className="ion-md-mail"></i></span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Enter Username</label>
          </div>

          <div className="input-box">
            <span className="icon"><i className="ion-md-mail"></i></span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Enter your email</label>
          </div>

          <div className="input-box">
            <span className="icon"><i className="ion-md-lock"></i></span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Enter your password</label>
          </div>

          <button type="submit" className="btn">Register</button>
        </form>

        <div className="register-link">
          <p>Already have an account?<Link to="/Login">Login</Link></p>
        </div>
      </div>
    </section>
  );
}

export default Register;
