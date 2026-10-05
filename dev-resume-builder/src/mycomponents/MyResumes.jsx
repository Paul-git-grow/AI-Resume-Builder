import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyResumes.css";

function MyResumes() {
  const navigate = useNavigate();

  const [savedResumes, setSavedResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET LOGGED-IN USER'S RESUMES FROM MONGODB
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
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
        console.error("Get Resumes Error:", error);
        alert("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [navigate]);

  // VIEW RESUME
  const handleView = (resume) => {
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

  // EDIT RESUME
  const handleEdit = (resume) => {
    localStorage.setItem("resumeMode", "edit");

    localStorage.setItem(
      "editingResumeId",
      String(resume._id || resume.id)
    );

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

    navigate("/create-resume");
  };

 // DELETE RESUME FROM MONGODB
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this resume?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/resumes/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to delete resume");
      return;
    }

    setSavedResumes((prev) =>
      prev.filter(
        (resume) =>
          String(resume._id || resume.id) !== String(id)
      )
    );

    alert("Resume deleted successfully!");
  } catch (error) {
    console.error("Delete Resume Error:", error);
    alert("Unable to connect to server");
  }
};

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUserId");

    navigate("/");
  };

  if (loading) {
    return (
      <div className="my-resumes-page">
        <p style={{ textAlign: "center", padding: "50px" }}>
          Loading resumes...
        </p>
      </div>
    );
  }

  return (
    <div className="my-resumes-page">

      <nav className="my-resumes-navbar">

        <div
          className="my-resumes-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span>AI</span> Resume
        </div>

        <div className="my-resumes-nav-links">

          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button className="active">
            My Resumes
          </button>

          <button onClick={() => navigate("/profile")}>
            Profile
          </button>

        </div>

        <button
          className="my-resumes-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      <main className="my-resumes-main">

        <section className="my-resumes-header">

          <div>

            <p className="my-resumes-label">
              RESUME MANAGEMENT
            </p>

            <h1>
              My <span>Resumes</span>
            </h1>

            <p>
              View, edit and manage all your saved resumes
              in one place.
            </p>

          </div>

        </section>


        <section className="resume-stats">

          <div className="resume-stat-card">

            <div className="resume-stat-icon purple">
              📄
            </div>

            <div>
              <p>Total Resumes</p>
              <h2>{savedResumes.length}</h2>
            </div>

          </div>


          <div className="resume-stat-card">

            <div className="resume-stat-icon blue">
              ✏️
            </div>

            <div>
              <p>Editable Resumes</p>

             <h2>{savedResumes.filter((resume) => resume.isEdited === true).length} </h2>

            </div>

          </div>


          <div className="resume-stat-card">

            <div className="resume-stat-icon green">
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

        </section>


        <section className="saved-resumes-section">

          <div className="saved-resumes-title">

            <div>

              <h2>Your Resumes</h2>

              <p>
                Manage your saved resume versions
              </p>

            </div>


            {savedResumes.length > 0 && (

              <span className="resume-count">

                {savedResumes.length} Resume

                {savedResumes.length > 1 ? "s" : ""}

              </span>

            )}

          </div>


          {savedResumes.length === 0 ? (

            <div className="empty-resumes-box">

              <div className="empty-resume-icon">
                📄
              </div>

              <h2>No resumes yet</h2>

              <p>
                You haven't created any resumes yet.
                Start building your professional resume today.
              </p>

            </div>

          ) : (

            <div className="saved-resumes-grid">

              {savedResumes.map((resume, index) => (

                <div
                  className="saved-resume-card"
                  key={resume._id || resume.id}
                >

                  <div className="resume-card-top">

                    <div className="resume-document-icon">
                      📄
                    </div>

                    <div className="resume-card-menu">
                      Resume {index + 1}
                    </div>

                  </div>


                  <div className="resume-card-info">

                    <h3>
                      {resume.title || `Resume ${index + 1}`}
                    </h3>

                    <p className="resume-template">

                      <span>Template</span>

                      {resume.selectedTemplate || "Modern"}

                    </p>

                    <p className="resume-saved-date">

                      🕒 Saved on{" "}

                      {resume.createdAt
                        ? new Date(
                            resume.createdAt
                          ).toLocaleDateString()
                        : "Recently"}

                    </p>

                  </div>


                  <div className="resume-card-actions">

                    <button
                      className="view-resume-btn"
                      onClick={() => handleView(resume)}
                    >
                      👁 View
                    </button>

                    <button
                      className="edit-resume-btn"
                      onClick={() => handleEdit(resume)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-resume-btn"
                      onClick={() =>
                        handleDelete(resume._id || resume.id)
                      }
                    >
                      🗑
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MyResumes;