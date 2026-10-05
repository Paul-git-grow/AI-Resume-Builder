import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({...formData,[name]: value,});
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.fullName ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    alert("Please fill all fields");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);

    navigate("/login");
  } catch (error) {
    console.error(error);
    alert("Unable to connect to server");
  }
};

  
    
  return (
    <div className="signup-page">

      <div className="signup-left">

        <div className="signup-brand">
          <span>AI</span> Resume
        </div>

        <div className="signup-left-content">

          <div className="signup-badge"> ✨ Start Your Career Journey </div>

          <h1>
            Create your resume.
            <br />
            <span>Stand out from the crowd.</span>
          </h1>

          <p>
            Build professional, ATS-friendly resumes with
            AI-powered assistance and beautiful templates.
          </p>

          <div className="signup-features">

            <div>
              <span>✓</span>
              Create multiple resumes
            </div>

            <div>
              <span>✓</span>
              AI-powered resume assistance
            </div>

            <div>
              <span>✓</span>
              Professional templates
            </div>

          </div>

        </div>

      </div>



      <div className="signup-right">

        <div className="signup-card">

          <div className="signup-heading">

            <h2>Create your account 🚀</h2>

            <p> Get started with your AI Resume Builder </p>

          </div>

          <form onSubmit={handleSubmit}>


            <label>Full Name</label>

            <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />


            <label>Email Address</label>

            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />


            <label>Password</label>

            <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange}/>

          
            <label>Confirm Password</label>

            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange}/>

            <button type="submit" className="signup-submit"> Create Account → </button>

          </form>

          <div className="signup-divider">
            <span>or</span>
          </div>

          <p className="login-text"> Already have an account?

            <button type="button" onClick={() => navigate("/login")}> Login </button>
          </p>

          <button type="button" className="signup-back-home" onClick={() => navigate("/")}> ← Back to Home </button>

        </div>

      </div>

    </div>
  );
}

export default SignUp;