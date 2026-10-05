import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({...prev,[name]: value,}));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // JWT token store
    localStorage.setItem("token", data.token);

    // Logged-in user id store
    localStorage.setItem("loggedInUserId", data.user.id);

    alert("Login successful");

    navigate("/dashboard");

  } catch (error) {
    console.error("Login Error:", error);

    alert("Unable to connect to server");
  }
};
  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">
          <span>AI</span> Resume
        </div>

        <div className="login-left-content">

          <div className="login-badge"> ✨ AI-Powered Resume Builder </div>

          <h1>
            Build your resume.
            <br />
            <span>Get hired faster.</span>
          </h1>

          <p>
            Create professional, ATS-friendly resumes with
            AI assistance and modern templates.
          </p>

          <div className="login-features">

            <div>
              <span>✓</span>
              AI-powered resume assistance
            </div>

            <div>
              <span>✓</span>
              Professional resume templates
            </div>

            <div>
              <span>✓</span>
              Download your resume as PDF
            </div>

          </div>

        </div>

      </div>


      <div className="login-right">

        <div className="login-card">

          <div className="login-heading">

            <h2>Welcome back 👋</h2>

            <p> Login to continue building your resume </p>

          </div>


          <form onSubmit={handleSubmit}>

            <label>Email Address</label>

            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}/>


            <div className="password-label">

              <label>Password</label>

              <button type="button" className="forgot-btn" onClick={() => alert("Forgot password feature coming soon")}>  Forgot password? </button>

            </div>

            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange}/>


            <button type="submit" className="login-submit"> Login → </button>

          </form>


          <div className="login-divider">
            <span>or</span>
          </div>


          <p className="signup-text">
            Don't have an account?
            <button onClick={() => navigate("/signup")}> Sign Up </button>
          </p>


          <button className="back-home" onClick={() => navigate("/")}> ← Back to Home </button>

        </div>

      </div>

    </div>
  );
}

export default Login;