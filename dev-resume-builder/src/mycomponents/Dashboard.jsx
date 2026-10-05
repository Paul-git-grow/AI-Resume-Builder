import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [savedResumes, setSavedResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET LOGGED-IN USER'S RESUMES FROM MONGODB
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/resumes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Unable to load resumes");

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUserId");

            navigate("/login");
          }

          return;
        }

        setSavedResumes(data.resumes || []);
      } catch (error) {
        console.error("Dashboard Resume Error:", error);
        alert("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [navigate]);

  // CREATE NEW RESUME
  const handleCreateResume = () => {
    localStorage.setItem("resumeMode", "create");

    localStorage.removeItem("editingResumeId");
    localStorage.removeItem("personalData");
    localStorage.removeItem("educationData");
    localStorage.removeItem("ResumeData");
    localStorage.removeItem("AISummary");
    localStorage.removeItem("selectedTemplate");

    navigate("/create-resume");
  };

  // VIEW RESUME
  const handleViewResume = (resume) => {
    localStorage.setItem(
      "editingResumeId",
      String(resume._id || resume.id)
    );

    localStorage.setItem("resumeMode", "edit");

    localStorage.setItem(
      "personalData",
      JSON.stringify(resume.personalData || {})
    );

    localStorage.setItem(
      "educationData",
      JSON.stringify(resume.educationData || {})
    );

    localStorage.setItem(
      "ResumeData",
      JSON.stringify(resume.resumeData || {})
    );

    localStorage.setItem(
      "AISummary",
      resume.aiSummary || ""
    );

    localStorage.setItem(
      "selectedTemplate",
      resume.selectedTemplate || "modern"
    );

    navigate("/ResumePreview");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUserId");

    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <p style={{ textAlign: "center", padding: "50px" }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <nav className="dashboard-navbar">

        <div
          className="dashboard-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span>AI</span> Resume
        </div>

        <div className="dashboard-nav-links">

          <button
            onClick={() => navigate("/dashboard")}
            className="active"
          >
            Dashboard
          </button>

          <button onClick={() => navigate("/MyResumes")}>
            My Resumes
          </button>

          <button onClick={() => navigate("/profile")}>
            Profile
          </button>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      <main className="dashboard-content">

        {/* Welcome */}
        <section className="dashboard-welcome">

          <div>

            <p className="welcome-small">
              Welcome back 👋
            </p>

            <h1>
              Build a resume that
              <span> gets noticed.</span>
            </h1>

            <p className="welcome-description">
              Create professional, ATS-friendly resumes with
              AI-powered assistance.
            </p>

          </div>

          <button
            className="create-resume-btn"
            onClick={handleCreateResume}
          >
            + Create New Resume
          </button>

        </section>


        {/* Stats */}
        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📄
            </div>

            <div>
              <p>Total Resumes</p>
              <h2>{savedResumes.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✨
            </div>

            <div>
              <p>AI Assisted</p>

              <h2>
                {
                  savedResumes.filter(
                    (resume) => resume.aiSummary
                  ).length
                }
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⬇️
            </div>

            <div>
          <p>Downloads</p>
<h2>
  {savedResumes.reduce(
    (total, resume) => total + (resume.downloadCount || 0),
    0
  )}
</h2>
            </div>

          </div>

        </section>


        {/* Quick Actions */}
        <section className="dashboard-section">

       <div className="dashboard-section-header">

  <div className="dashboard-section-title">
    <h2>Quick Actions</h2>
    <p>Start building your professional profile</p>
  </div>

</div>

          <div className="quick-actions">

            <div className="action-card" onClick={handleCreateResume}>

              <div className="action-icon purple"> 📄 </div>

              <h3>Create Resume</h3>

              <p>
                Start a new professional resume
                from scratch.
              </p>

              <span>Get Started →</span>

            </div>


            <div className="action-card" onClick={() => navigate("/MyResumes")}>

              <div className="action-icon blue"> 📁 </div>

              <h3>My Resumes</h3>

              <p>
                View, edit and manage your
                saved resumes.
              </p>

              <span>View Resumes →</span>

            </div>


            <div className="action-card" onClick={() => navigate("/AiAssistance")}>

              <div className="action-icon green"> 🤖 </div>

              <h3>AI Assistant</h3>

              <p>
                Improve your resume using
                AI-powered suggestions.
              </p>

              <span>Try AI →</span>

            </div>


            <div className="action-card" onClick={() => navigate("/ats-checker")}>
            
            <div className="action-icon purple"> 📊 </div>
            <h3>ATS Resume Checker</h3>

  <p>
    Analyze your resume and check its
    ATS-friendly score and suggestions.
  </p>

  <span>Check ATS Score →</span>
</div>

          </div>

        </section>


        {/* Recent Resumes */}
        <section className="dashboard-section">

        <div className="dashboard-section-header">

  <div className="dashboard-section-title">
    <h2>Recent Resumes</h2>
    <p>Your recently created resumes</p>
  </div>

  <button
    className="view-all-btn"
    onClick={() => navigate("/MyResumes")}
  >
    View All
  </button>

</div>


          {savedResumes.length === 0 ? (

            <div className="empty-resumes">

              <div className="empty-icon">
                📄
              </div>

              <h3>No resumes yet</h3>

              <p>
                Create your first resume and start
                building your career profile.
              </p>

              <button onClick={handleCreateResume}>
                Create Your First Resume →
              </button>

            </div>

          ) : (

            <div className="dashboard-recent-resumes">

              {savedResumes
                .slice(0, 3)
                .map((resume) => (

                  <div
                    className="dashboard-resume-card"
                    key={resume._id || resume.id}
                  >

                    <div className="dashboard-resume-icon">
                      📄
                    </div>


                    <div className="dashboard-resume-info">

                      <h3>
                        {resume.title || "My Resume"}
                      </h3>

                      <p>
                        Template:{" "}
                        {resume.selectedTemplate || "Modern"}
                      </p>

                      <small>
                        Saved:{" "}
                        {resume.createdAt
                          ? new Date(
                              resume.createdAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </small>

                    </div>


                    <button
                      onClick={() => handleViewResume(resume)}
                    >
                      View →
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;