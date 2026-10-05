import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResumePreview.css";

function ResumePreview() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState({});
  const [resume, setResume] = useState({});
  const [summary, setSummary] = useState("");
  const [template, setTemplate] = useState("modern");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPersonal(
      JSON.parse(localStorage.getItem("personalData") || "{}")
    );

    setEducation(
      JSON.parse(localStorage.getItem("educationData") || "{}")
    );

    setResume(
      JSON.parse(localStorage.getItem("ResumeData") || "{}")
    );

    setSummary(localStorage.getItem("AISummary") || "");

    setTemplate(
      localStorage.getItem("selectedTemplate") || "modern"
    );
  }, []);

  // EDIT RESUME
  const handleEdit = () => {
    localStorage.setItem("resumeMode", "edit");
    navigate("/create-resume");
  };

  // BACK TO TEMPLATE PAGE
  const handleBack = () => {
    navigate("/templates");
  };

  // CREATE OR UPDATE RESUME
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      setSaving(true);

      const resumeMode = localStorage.getItem("resumeMode");
      const editingResumeId = localStorage.getItem("editingResumeId");

      const isEditing =
        resumeMode === "edit" && editingResumeId;

      const resumeData = {
        title: personal.fullName
          ? `${personal.fullName}'s Resume`
          : "My Resume",

        personalData: personal,
        educationData: education,
        resumeData: resume,
        aiSummary: summary,
        selectedTemplate: template,
      };

      const url = isEditing
        ? `http://localhost:5000/api/resumes/${editingResumeId}`
        : "http://localhost:5000/api/resumes";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            (isEditing
              ? "Unable to update resume"
              : "Unable to save resume")
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUserId");
          navigate("/login");
        }

        return;
      }

      if (data.resume?._id) {
        localStorage.setItem(
          "editingResumeId",
          data.resume._id
        );
      }

      localStorage.setItem("resumeMode", "edit");

      alert(
        isEditing
          ? "Resume updated successfully!"
          : "Resume saved successfully!"
      );

      navigate("/MyResumes");
    } catch (error) {
      console.error("Save/Update Resume Error:", error);
      alert("Unable to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
  try {
    const token = localStorage.getItem("token");
    const editingResumeId = localStorage.getItem("editingResumeId");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (editingResumeId) {
      const response = await fetch(
        `http://localhost:5000/api/resumes/${editingResumeId}/download`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error(
          "Download count update failed:",
          data.message
        );
      }
    }

    window.print();
  } catch (error) {
    console.error("Download Error:", error);

    // Count update fail ஆனாலும் PDF print/download open ஆகட்டும்
    window.print();
  }
};

  const skills = resume.skills
    ? resume.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  // CLEAN DISPLAY LINK
  const cleanLink = (value, type) => {
    if (!value) return "";

    if (type === "linkedin") {
      return "LinkedIn";
    }

    if (type === "github") {
      return "GitHub";
    }

    return value;
  };

  const getLink = (value) => {
    if (!value) return "#";

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return `https://${value}`;
  };

  // CONTACT USED IN TOP AREA
 const TopContact = () => (
  <div className="top-contact">

    <div className="top-contact-primary">

      {personal.email && (
        <span>{personal.email}</span>
      )}

      {personal.phone && (
        <span>{personal.phone}</span>
      )}

      {personal.location && (
        <span>{personal.location}</span>
      )}

    </div>

    {(personal.linkedin || personal.github) && (
      <div className="top-contact-links">

        {personal.linkedin && (
          <a href={getLink(personal.linkedin)} target="_blank" rel="noreferrer">
            LinkedIn: {personal.linkedin}
          </a>
        )}

        {personal.github && (
          <a href={getLink(personal.github)} target="_blank" rel="noreferrer">
            GitHub: {personal.github}
          </a>
        )}

      </div>
    )}

  </div>
);

  // MODERN SIDEBAR CONTACT
  const SidebarContact = () => (
    <div className="sidebar-contact">

      {personal.email && (
        <div>
          <strong>Email</strong>
          <span>{personal.email}</span>
        </div>
      )}

      {personal.phone && (
        <div>
          <strong>Phone</strong>
          <span>{personal.phone}</span>
        </div>
      )}

      {personal.location && (
        <div>
          <strong>Location</strong>
          <span>{personal.location}</span>
        </div>
      )}

     {personal.linkedin && (
  <div>
    <strong>LinkedIn</strong>

    <a href={getLink(personal.linkedin)} target="_blank" rel="noreferrer">
      {personal.linkedin}
    </a>
  </div>
)}


  {personal.github && (
  <div>
    <strong>GitHub</strong>

    <a href={getLink(personal.github)} target="_blank" rel="noreferrer">
      {personal.github}
    </a>
  </div>
)}

    </div>
  );

  const EducationContent = () => (
    <div className="education-item">

      <div className="education-heading">

        <strong>
          {education.degree}
        </strong>

        {education.score && (
          <span>
            CGPA: {education.score}
          </span>
        )}

      </div>

      {education.college && (
        <p>{education.college}</p>
      )}

      {education.department && (
        <small>{education.department}</small>
      )}

    </div>
  );

  const SkillsContent = () => (
    <div className="skills-list">

      {skills.map((skill, index) => (
        <span key={index}>
          {skill}
        </span>
      ))}

    </div>
  );

  const CommonSections = () => (
    <>

      {summary && (
        <section className="resume-section">
          <h2>Professional Summary</h2>

          <p className="summary-text">
            {summary}
          </p>
        </section>
      )}

      {resume.experience && (
        <section className="resume-section">
          <h2>Experience</h2>

          <div className="project-content">
            {resume.experience}
          </div>
        </section>
      )}

      {(education.degree ||
        education.college ||
        education.department ||
        education.score) && (
        <section className="resume-section">

          <h2>Education</h2>

          <EducationContent />

        </section>
      )}

      {skills.length > 0 && (
        <section className="resume-section">

          <h2>Skills</h2>

          <SkillsContent />

        </section>
      )}

      {resume.projects && (
        <section className="resume-section">

          <h2>Projects</h2>

          <div className="project-content">
            {resume.projects}
          </div>

        </section>
      )}

      {resume.certifications && (
        <section className="resume-section">

          <h2>Certifications</h2>

          <div className="project-content">
            {resume.certifications}
          </div>

        </section>
      )}

      {resume.achievements && (
        <section className="resume-section">

          <h2>Achievements</h2>

          <div className="project-content">
            {resume.achievements}
          </div>

        </section>
      )}

    </>
  );

  // ================= MODERN =================

  const ModernTemplate = () => (
    <div className="resume-paper modern">

      <header className="modern-header">

        <h1>
          {personal.fullName || "Your Name"}
        </h1>

        <p>
          {education.degree || "Professional"}
        </p>

      </header>

      <div className="modern-layout">

        <aside className="modern-sidebar">

          <div className="modern-sidebar-section">
            <h2>Contact</h2>
            <SidebarContact />
          </div>

          {skills.length > 0 && (
            <div className="modern-sidebar-section">

              <h2>Skills</h2>

              <SkillsContent />

            </div>
          )}

          {(education.degree ||
            education.college ||
            education.department ||
            education.score) && (
            <div className="modern-sidebar-section">

              <h2>Education</h2>

              <EducationContent />

            </div>
          )}

        </aside>

        <main className="modern-main">

          {summary && (
            <section className="resume-section">

              <h2>Professional Summary</h2>

              <p className="summary-text">
                {summary}
              </p>

            </section>
          )}

          {resume.experience && (
            <section className="resume-section">

              <h2>Experience</h2>

              <div className="project-content">
                {resume.experience}
              </div>

            </section>
          )}

          {resume.projects && (
            <section className="resume-section">

              <h2>Projects</h2>

              <div className="project-content">
                {resume.projects}
              </div>

            </section>
          )}

          {resume.certifications && (
            <section className="resume-section">

              <h2>Certifications</h2>

              <div className="project-content">
                {resume.certifications}
              </div>

            </section>
          )}

          {resume.achievements && (
            <section className="resume-section">

              <h2>Achievements</h2>

              <div className="project-content">
                {resume.achievements}
              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  );

  // ================= MINIMAL =================

  const MinimalTemplate = () => (
    <div className="resume-paper minimal">

      <header className="minimal-header">

        <h1>
          {personal.fullName || "Your Name"}
        </h1>

        <p className="minimal-role">
          {education.degree || "Professional"}
        </p>

        <TopContact />

      </header>

      <div className="minimal-content">
        <CommonSections />
      </div>

    </div>
  );

  // ================= PROFESSIONAL =================

  const ProfessionalTemplate = () => (
    <div className="resume-paper professional">

      <header className="professional-header">

        <div className="professional-name-area">

          <h1>
            {personal.fullName || "Your Name"}
          </h1>

          <p>
            {education.degree || "Professional"}
          </p>

        </div>

        <TopContact />

      </header>

      <div className="professional-line"></div>

      <div className="professional-content">
        <CommonSections />
      </div>

    </div>
  );

  // ================= EXECUTIVE =================

  const ExecutiveTemplate = () => (
    <div className="resume-paper executive">

      <div className="executive-top-bar"></div>

      <header className="executive-header">

        <h1>
          {personal.fullName || "Your Name"}
        </h1>

        <p className="executive-role">
          {education.degree || "Professional"}
        </p>

        <TopContact />

      </header>

      <div className="executive-divider">
        <span></span>
      </div>

      <div className="executive-content">
        <CommonSections />
      </div>

    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate />;

      case "professional":
        return <ProfessionalTemplate />;

      case "executive":
        return <ExecutiveTemplate />;

      case "modern":
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="preview-page">

      <nav className="preview-navbar">

        <div className="preview-logo" onClick={() => navigate("/dashboard")}>
          <span>AI</span> Resume
        </div>

        <h1 className="preview-nav-title"> Resume Preview </h1>

        <div className="preview-nav-actions">

          <button className="preview-edit-btn" onClick={handleEdit}> ✏️ Edit Resume </button>

          <button className="preview-save-btn" onClick={handleSave} disabled={saving}>
            {saving
              ? "Saving..."
              : "Save Resume"}
          </button>

        </div>

      </nav>

      <main className="preview-main">

        <div className="preview-toolbar">

          <div>

            <h1> Preview your resume </h1>

            <p> Review your resume before downloading it. </p>

          </div>

          <div className="preview-toolbar-actions">

            <button onClick={handleBack} className="change-template-btn"> ← Change Template </button>

           <button className="download-btn" onClick={handleDownload}> ⬇ Download PDF </button>

          </div>

        </div>

        <div className="resume-wrapper">
          {renderTemplate()}
        </div>

      </main>

    </div>
  );
}

export default ResumePreview;