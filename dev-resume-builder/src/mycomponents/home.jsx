import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      <nav className="navbar">

        <div className="logo" onClick={() => navigate("/home")} >
          <span>AI</span> Resume
        </div>

        <div className="nav-links">
          <button onClick={() => window.location.href ="/"}> Home </button>

          <button onClick={() => navigate("/login")}> My Resumes</button>

          <button onClick={() => navigate("/profile")}> Profile </button>
        </div>

        <div className="nav-actions">
          <button className="login-btn" onClick={() => navigate("/login")} > Login </button>

          <button className="signup-btn" onClick={() => navigate("/signup")}> Sign Up </button>
        </div>

      </nav>


      <section className="hero-section">

        <div className="hero-content">

          <div className="badge"> ✨ AI-Powered Resume Builder </div>

          <h1> Build a Professional
            <br />
            <span>Resumes with AI</span>
          </h1>

          <p>
            Create an impressive, ATS-friendly resume in minutes.
            Get AI-powered suggestions, professional templates,
            and personalized resume improvements.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn" onClick={() => navigate("/login")}> Create My Resume → </button>

            <button className="secondary-btn" onClick={() => navigate("/login")}> View My Resumes </button>

          </div>

          <div className="hero-info">
            <span>✓ AI Assistance</span>
            <span>✓ Professional Templates</span>
            <span>✓ PDF Download</span>
          </div>

        </div>


     <div className="hero-preview">

  <div className="resume-card">


    <div className="resume-top">

      <div className="profile-circle"></div>

      <div className="resume-name">
        <div className="line name-line"></div>
        <div className="line small-line"></div>
      </div>

    </div>



    <div className="preview-section1">

      <div className="preview-title1"></div>
      <br></br>
      <div className="preview-line1"></div>
      <div className="preview-line1"></div>
      <div className="preview-line1 short"></div>

    </div>



    <div className="preview-section2">

      <div className="preview-title2"></div>
      <br></br>
      <div className="preview-line2"></div>
      <div className="preview-line2"></div>

    </div>



    <div className="preview-section3">

      <div className="preview-title3"></div>
      <div className="skill-row">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="skill-row">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>

  </div>


  <div className="ai-floating-card">

    <div className="ai-icon"> 🤖</div>

    <div className="ai-text">
      <strong>AI Assistant</strong>
      <strong>Resume Improved</strong>
    </div>

  </div>

</div>

      </section>


      <section className="features-section">

        <div className="section-heading">

          <p>POWERFUL FEATURES</p>

          <h2> Everything you need to build a better resume
          </h2>

        </div>


        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistance</h3>
            <p>
              Generate professional summaries, improve projects,
              and get personalized resume suggestions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Professional Templates</h3>
            <p>
              Choose from modern, minimal and executive resume
              templates designed for professionals.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>ATS Friendly</h3>
            <p>
              Create clean and structured resumes that are easier
              for Applicant Tracking Systems to read.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick & Easy</h3>
            <p>
              Build, edit and download your resume in just a
              few simple steps.
            </p>
          </div>

        </div>

      </section>



      <section className="cta-section">

        <h2>
          Ready to create your
          <br />
          professional resume?
        </h2>

        <p> Start building your resume with AI today. </p>

        <button className="primary-btn" onClick={() => navigate("/login")}> Get Started — It's Free →  </button>

      </section>


      <footer className="footer">

        <div className="footer-logo">
          <span>AI</span> Resume
        </div>

        <p> Build smarter. Apply better. Get hired.</p>

        <div className="footer-links1">
          <span>© 2026 AI Resume Builder</span>
        </div>

        <div className="footer-links2">
          <span>Privacy & Terms</span>
        </div>


      </footer>

    </div>
  );
}

export default Home;