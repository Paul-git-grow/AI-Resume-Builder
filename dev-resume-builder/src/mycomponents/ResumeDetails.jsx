import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResumeDetails.css";

function ResumeDetails() {
  const navigate = useNavigate();

  const isEditing =
    localStorage.getItem("resumeMode") === "edit";

  // Safely read existing ResumeData
  let savedResumeData = {};

  try {
    savedResumeData = isEditing? JSON.parse(localStorage.getItem("ResumeData") || "{}"): {};
  } catch (error) {
    console.error("ResumeData read error:", error);
    savedResumeData = {};
  }

  // Standard ResumeData structure
  // Lowercase keys are used throughout the application.
  // Capital-key fallback keeps older saved resumes working.
  const [Resumex, setResumex] = useState({
    skills:
      savedResumeData.skills ||
      savedResumeData.Skills ||
      "",

    projects:
      savedResumeData.projects ||
      savedResumeData.Projects ||
      "",

    certifications:
      savedResumeData.certifications ||
      savedResumeData.Certifications ||
      "",

    achievements:
      savedResumeData.achievements ||
      savedResumeData.Achievements ||
      savedResumeData.Archivements ||
      "",

    experience:
      savedResumeData.experience ||
      savedResumeData.Experience ||
      "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResumex((prev) => ({...prev,[name]: value,}));
  };

  const handleNext = (e) => {
    e.preventDefault();

    localStorage.setItem("ResumeData",JSON.stringify(Resumex));

    navigate("/AiAssistance");
  };

  const handleSaveAndExit = () => {localStorage.setItem("ResumeData",JSON.stringify(Resumex));

    navigate("/dashboard");
  };

  return (
    <div className="details-page">

      <nav className="details-navbar">

        <div className="details-logo" onClick={() => navigate("/dashboard")}>
          <span>AI</span> Resume
        </div>

        <div className="details-step"> Step 3 of 6 </div>

        <button className="details-exit" onClick={handleSaveAndExit}> Save & Exit </button>

      </nav>


      <div className="details-progress-container">

        <div className="details-progress-info">
          <span>Resume Details</span>
          <span>50% Complete</span>
        </div>

        <div className="details-progress-bar">
          <div className="details-progress-fill"></div>
        </div>

      </div>


      <main className="details-main">

        <div className="details-heading">

          <p className="details-label"> RESUME BUILDER </p>

          <h1>
            Add your
            <span> professional details</span>
          </h1>

          <p>
            Highlight your skills, projects, achievements and
            experience to make your resume stand out.
          </p>

        </div>


        <div className="details-card">

          <div className="details-card-title">

            <div className="details-icon"> 💼 </div>

            <div>
              <h2>Professional Information</h2>
              <p>Showcase your skills and experience</p>
            </div>

          </div>


          <form onSubmit={handleNext}>

            {/* SKILLS */}
            <div className="details-form-group">

              <label>
                Skills <span>*</span>
              </label>

              <textarea name="skills" placeholder="Example: Java, Python, React.js, Node.js, MongoDB, Git" value={Resumex.skills} onChange={handleChange} required />

              <small>
                Separate multiple skills using commas.
              </small>

            </div>


            {/* PROJECTS */}
            <div className="details-form-group">

              <label>
                Projects
              </label>

              <textarea name="projects" placeholder={`Example: Spotify Recommendation System Built a recommendation system using Python and machine learning.`} value={Resumex.projects} onChange={handleChange} />

              <small>
                Include project name, technologies and what you built.
              </small>

            </div>


            {/* CERTIFICATIONS */}
            <div className="details-form-group">

              <label>
                Certifications
              </label>

              <textarea name="certifications" placeholder={`Example: Python Programming Certification Cloud Computing Certification`} value={Resumex.certifications} onChange={handleChange}/>

            </div>


            {/* ACHIEVEMENTS */}
            <div className="details-form-group">

              <label>
                Achievements
              </label>

              <textarea name="achievements" placeholder={`Example: Won first prize in college hackathon,Completed 100+ coding problems`} value={Resumex.achievements} onChange={handleChange}/>

            </div>


            {/* EXPERIENCE */}
            <div className="details-form-group">

              <label>
                Experience / Internship
              </label>

              <textarea name="experience" placeholder={`Example: Software Developer Intern, ABC Technologies,June 2026 - August 2026,Worked on frontend development using React.js.`} value={Resumex.experience} onChange={handleChange}/>

              <small>
                If you are a fresher, you can leave this empty.
              </small>

            </div>


            {/* AI TIP */}
            <div className="details-tip">

              <div className="details-tip-icon"> ✨ </div>

              <div>

                <strong>
                  Make it stronger with AI
                </strong>

                <p>
                  After saving these details, our AI Assistant
                  can help improve your projects, suggest skills
                  and create a professional summary.
                </p>

              </div>

            </div>


            {/* ACTIONS */}
            <div className="details-actions">

              <button type="button" className="details-back-btn" onClick={() => navigate("/education")}>  ← Back </button>

              <button type="submit"  className="details-next-btn">  Save & Continue → </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default ResumeDetails;