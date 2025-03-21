// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";


// function Register () {
//   const [name, setName] = useState()
//   const [email, setEmail] = useState()
//   const [password, setPassword] = useState()

//   const handleSubmit = (e) => {
//     e.prevenDefault()
//     axios.post('http://localhost:4000/register', {name, email, password})
//     .then(result => console.log(result))
//     .catch(err => console.log(err))
//   }

//     return (
//         <section className="Home">
//       <div className="content">
//         <h2>SEAsync.</h2>
//         <p>Integrated Aquatic and Resource Monitoring System</p>
//         <a href="#">Get Started</a>
//       </div>

//       <div className="login">
//         <h2>Register</h2>
//         <form onSubmit={handleSubmit}>
//             <div className="input-box">
//                 <span className="icon"><i className="ion-md-mail"></i></span>
//                 <input type="name"
//                 onChange={(e) => setName(e.target.value)} />
//                 <label>Enter Username</label>
//             </div>

//           <div className="input-box">
//             <span className="icon"><i className="ion-md-mail"></i></span>
//             <input type="email" required
//             onChange={(e) => setEmail(e.target.value)} />
//             <label>Enter your email</label>
//           </div>

//           <div className="input-box">
//             <span className="icon"><i className="ion-md-lock"></i></span>
//             <input type="password" required
//             onChange={(e) => setPassword(e.target.value)} />
//             <label>Enter your password</label>
//           </div>
//           <button type="submit" className="btn">Register</button>
//         </form>
//         <div className="register-link">
//             <p>Already have an account?<Link to="/Login">Login</Link></p>
//           </div>
//       </div>
//     </section>
//     )
// }

// export default Register;