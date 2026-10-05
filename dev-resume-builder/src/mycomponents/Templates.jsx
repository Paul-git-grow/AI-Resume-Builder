import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Templates.css";

function Templates() {
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState(
    localStorage.getItem("selectedTemplate") || "modern"
  );

  const templates = [
    {
      id: "modern",
      name: "Modern",
      description:
        "A fresh two-column layout with a bold professional accent.",
      tag: "Popular",
    },
    {
      id: "minimal",
      name: "Minimal",
      description:
        "A clean single-column layout that keeps the focus on your content.",
      tag: "ATS Friendly",
    },
    {
      id: "professional",
      name: "Professional",
      description:
        "A structured corporate layout designed for formal job applications.",
      tag: "Corporate",
    },
    {
      id: "executive",
      name: "Executive",
      description:
        "A refined premium layout for experienced professionals and leaders.",
      tag: "Premium",
    },
  ];

  const handleSelect = (id) => {
    setSelectedTemplate(id);
    localStorage.setItem("selectedTemplate", id);
  };

  const handleContinue = () => {
    localStorage.setItem(
      "selectedTemplate",
      selectedTemplate
    );

    navigate("/ResumePreview");
  };

  return (
    <div className="templates-page">

      <nav className="templates-navbar">

        <div
          className="templates-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span>AI</span> Resume
        </div>

        <div className="templates-step">
          Step 5 of 6
        </div>

        <button
          className="templates-exit"
          onClick={() => navigate("/dashboard")}
        >
          Save & Exit
        </button>

      </nav>


      <div className="templates-progress-container">

        <div className="templates-progress-info">
          <span>Choose Template</span>
          <span>83% Complete</span>
        </div>

        <div className="templates-progress-bar">
          <div className="templates-progress-fill"></div>
        </div>

      </div>


      <main className="templates-main">

        <div className="templates-heading">

          <p className="templates-label">
            RESUME BUILDER
          </p>

          <h1>
            Choose your
            <span> perfect template</span>
          </h1>

          <p>
            Pick a professional layout that matches your
            career style. You can always change it later.
          </p>

        </div>


        <div className="templates-grid">

          {templates.map((template) => (

            <div
              key={template.id}
              className={`template-card ${
                selectedTemplate === template.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleSelect(template.id)
              }
            >

              <div className="template-card-badge">
                {template.tag}
              </div>


              {/* ================= MODERN ================= */}

              {template.id === "modern" && (

                <div className="resume-mini modern-mini">

                  <div className="modern-mini-header">

                    <div>
                      <div className="mini-name">
                        ALEX MORGAN
                      </div>

                      <div className="mini-role">
                        SOFTWARE DEVELOPER
                      </div>
                    </div>

                    <div className="mini-contact">
                      alex@email.com
                      <br />
                      +91 98765 43210
                    </div>

                  </div>


                  <div className="modern-mini-body">

                    <aside className="modern-mini-sidebar">

                      <MiniSectionTitle text="CONTACT" />

                      <MiniLines
                        lines={[
                          "Chennai, India",
                          "linkedin.com/alex",
                          "github.com/alex",
                        ]}
                      />

                      <MiniSectionTitle text="SKILLS" />

                      <div className="mini-skill">
                        React
                      </div>

                      <div className="mini-skill">
                        JavaScript
                      </div>

                      <div className="mini-skill">
                        Node.js
                      </div>

                      <MiniSectionTitle text="EDUCATION" />

                      <MiniLines
                        lines={[
                          "B.E Computer Science",
                          "ABC University",
                          "2022 - 2026",
                        ]}
                      />

                    </aside>


                    <div className="modern-mini-content">

                      <MiniSectionTitle text="PROFILE" />

                      <MiniParagraph />

                      <MiniSectionTitle text="EXPERIENCE" />

                      <MiniJob
                        title="Frontend Developer"
                        company="Tech Solutions"
                      />

                      <MiniSectionTitle text="PROJECTS" />

                      <MiniJob
                        title="AI Resume Builder"
                        company="React • Node.js"
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* ================= MINIMAL ================= */}

              {template.id === "minimal" && (

                <div className="resume-mini minimal-mini">

                  <div className="minimal-mini-header">

                    <div className="minimal-mini-name">
                      ALEX MORGAN
                    </div>

                    <div className="minimal-mini-role">
                      Software Developer
                    </div>

                    <div className="minimal-contact">
                      alex@email.com &nbsp; • &nbsp;
                      +91 98765 43210 &nbsp; • &nbsp;
                      Chennai
                    </div>

                  </div>


                  <div className="minimal-divider"></div>


                  <MiniSectionTitle text="PROFESSIONAL SUMMARY" />

                  <MiniParagraph />


                  <MiniSectionTitle text="EXPERIENCE" />

                  <div className="minimal-row">

                    <strong>
                      Frontend Developer
                    </strong>

                    <span>
                      2025 - Present
                    </span>

                  </div>

                  <div className="minimal-company">
                    Tech Solutions
                  </div>

                  <MiniParagraph />


                  <MiniSectionTitle text="EDUCATION" />

                  <div className="minimal-row">

                    <strong>
                      B.E Computer Science
                    </strong>

                    <span>
                      2022 - 2026
                    </span>

                  </div>

                  <div className="minimal-company">
                    ABC University
                  </div>


                  <MiniSectionTitle text="SKILLS" />

                  <div className="minimal-skills">
                    React • JavaScript • Node.js • MongoDB
                  </div>

                </div>

              )}


              {/* ================= PROFESSIONAL ================= */}

              {template.id === "professional" && (

                <div className="resume-mini professional-mini">

                  <div className="professional-header">

                    <div className="professional-name">
                      ALEX MORGAN
                    </div>

                    <div className="professional-role">
                      SOFTWARE DEVELOPER
                    </div>

                    <div className="professional-contact">
                      Chennai, India | alex@email.com |
                      +91 98765 43210
                    </div>

                  </div>


                  <div className="professional-body">

                    <ProfessionalTitle text="PROFESSIONAL SUMMARY" />

                    <MiniParagraph />


                    <ProfessionalTitle text="WORK EXPERIENCE" />

                    <div className="professional-job">

                      <div className="professional-job-row">

                        <strong>
                          Frontend Developer
                        </strong>

                        <span>
                          2025 - Present
                        </span>

                      </div>

                      <small>
                        Tech Solutions, Chennai
                      </small>

                      <MiniParagraph />

                    </div>


                    <ProfessionalTitle text="EDUCATION" />

                    <div className="professional-job-row">

                      <strong>
                        B.E Computer Science
                      </strong>

                      <span>
                        2022 - 2026
                      </span>

                    </div>

                    <small>
                      ABC University
                    </small>


                    <ProfessionalTitle text="CORE SKILLS" />

                    <div className="professional-skills">
                      React &nbsp; | &nbsp;
                      JavaScript &nbsp; | &nbsp;
                      Node.js &nbsp; | &nbsp;
                      MongoDB
                    </div>

                  </div>

                </div>

              )}


              {/* ================= EXECUTIVE ================= */}

              {template.id === "executive" && (

                <div className="resume-mini executive-mini">

                  <div className="executive-top-line"></div>

                  <div className="executive-header">

                    <div className="executive-name">
                      ALEX MORGAN
                    </div>

                    <div className="executive-role">
                      SENIOR SOFTWARE PROFESSIONAL
                    </div>

                    <div className="executive-contact">
                      Chennai • alex@email.com •
                      +91 98765 43210
                    </div>

                  </div>


                  <div className="executive-divider">
                    <span></span>
                  </div>


                  <div className="executive-body">

                    <ExecutiveTitle text="EXECUTIVE PROFILE" />

                    <MiniParagraph />


                    <ExecutiveTitle text="PROFESSIONAL EXPERIENCE" />

                    <div className="executive-job-row">

                      <div>
                        <strong>
                          Senior Developer
                        </strong>

                        <small>
                          Tech Solutions
                        </small>
                      </div>

                      <span>
                        2024 - Present
                      </span>

                    </div>

                    <MiniParagraph />


                    <ExecutiveTitle text="EDUCATION" />

                    <div className="executive-job-row">

                      <div>
                        <strong>
                          B.E Computer Science
                        </strong>

                        <small>
                          ABC University
                        </small>
                      </div>

                      <span>
                        2022 - 2026
                      </span>

                    </div>


                    <ExecutiveTitle text="EXPERTISE" />

                    <div className="executive-skills">

                      <span>React</span>
                      <span>JavaScript</span>
                      <span>Node.js</span>
                      <span>MongoDB</span>

                    </div>

                  </div>

                </div>

              )}


              <div className="template-info">

                <div>

                  <h2>
                    {template.name}
                  </h2>

                  <p>
                    {template.description}
                  </p>

                </div>


                <div className="template-radio">

                  {selectedTemplate ===
                    template.id && (
                    <span>✓</span>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>


        <div className="templates-tip">

          <div className="templates-tip-icon">
            💡
          </div>

          <div>

            <strong>
              Template tip
            </strong>

            <p>
              For ATS-based applications, clean layouts
              such as Minimal or Professional keep the
              resume easy to scan and read.
            </p>

          </div>

        </div>


        <div className="templates-actions">

          <button
            className="templates-back-btn"
            onClick={() =>
              navigate("/AiAssistance")
            }
          >
            ← Back
          </button>

          <button
            className="templates-continue-btn"
            onClick={handleContinue}
          >
            Preview Resume →
          </button>

        </div>

      </main>

    </div>
  );
}


/* ================= MINI COMPONENTS ================= */

function MiniSectionTitle({ text }) {
  return (
    <div className="mini-section-title">
      {text}
    </div>
  );
}


function ProfessionalTitle({ text }) {
  return (
    <div className="professional-section-title">
      {text}
    </div>
  );
}


function ExecutiveTitle({ text }) {
  return (
    <div className="executive-section-title">
      {text}
    </div>
  );
}


function MiniLines({ lines }) {
  return (
    <div className="mini-lines">
      {lines.map((line, index) => (
        <div key={index}>
          {line}
        </div>
      ))}
    </div>
  );
}


function MiniParagraph() {
  return (
    <div className="mini-paragraph">
      Results-driven professional with strong
      problem-solving skills and experience building
      modern applications.
    </div>
  );
}


function MiniJob({ title, company }) {
  return (
    <div className="mini-job">

      <strong>
        {title}
      </strong>

      <span>
        {company}
      </span>

      <div className="mini-job-line"></div>
      <div className="mini-job-line short"></div>

    </div>
  );
}


export default Templates;