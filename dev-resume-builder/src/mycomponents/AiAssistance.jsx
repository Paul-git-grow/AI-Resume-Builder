import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiAssistance.css";

function AIAssistance() {
  const navigate = useNavigate();

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeOption, setActiveOption] = useState("");
  const [applied, setApplied] = useState(false);

  // Read JSON data safely from localStorage
  const getLocalStorageData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return {};
    }
  };

  // Collect complete resume information
  const getResumeContext = () => {
    const personalData = getLocalStorageData("personalData");
    const educationData = getLocalStorageData("educationData");
    const resumeData = getLocalStorageData("ResumeData");
    const aiSummary = localStorage.getItem("AISummary") || "";

    return {
      personalData,
      educationData,
      resumeData,
      aiSummary,
    };
  };

  // Common AI generation function
  const generateAIContent = async (type) => {
    try {
      setActiveOption(type);
      setLoading(true);
      setResult("");
      setApplied(false);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const resumeContext = getResumeContext();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
            content: resumeContext,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUserId");

          alert("Your session has expired. Please login again.");
          navigate("/login");
          return;
        }

        alert(data.message || "Unable to generate AI content");
        return;
      }

      // Complete resume comes from backend as an object.
      // Convert it into readable JSON for the textarea.
      if (type === "resume" && data.result) {
        setResult(JSON.stringify(data.result, null, 2));
      } else {
        setResult(data.result || "");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);

      alert(
        "Unable to connect to AI server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    generateAIContent("summary");
  };

  const improveProject = () => {
    generateAIContent("project");
  };

  const suggestSkills = () => {
    generateAIContent("skills");
  };

  const improveExperience = () => {
    generateAIContent("experience");
  };

  const improveCertifications = () => {
    generateAIContent("certifications");
  };

  const improveAchievements = () => {
    generateAIContent("achievements");
  };

  const improveResume = () => {
    generateAIContent("resume");
  };

  // Apply generated AI content to resume
  const handleApplyToResume = () => {
    const finalResult = result.trim();

    if (!finalResult) {
      alert("Please generate AI content first.");
      return;
    }

    // PROFESSIONAL SUMMARY
    if (activeOption === "summary") {
      localStorage.setItem("AISummary", finalResult);

      setApplied(true);
      alert("Professional summary added to resume!");
      return;
    }

    // Existing resume data
    const existingResumeData =
      getLocalStorageData("ResumeData");

    let updatedResumeData = {
      ...existingResumeData,
    };

    // SKILLS
    if (activeOption === "skills") {
      updatedResumeData.skills = finalResult;

      localStorage.setItem(
        "ResumeData",
        JSON.stringify(updatedResumeData)
      );

      setApplied(true);
      alert("AI suggested skills added to resume!");
      return;
    }

    // PROJECT
    if (activeOption === "project") {
      updatedResumeData.projects = finalResult;

      localStorage.setItem(
        "ResumeData",
        JSON.stringify(updatedResumeData)
      );

      setApplied(true);
      alert("Improved project description added to resume!");
      return;
    }

    // EXPERIENCE
    if (activeOption === "experience") {
      updatedResumeData.experience = finalResult;

      localStorage.setItem(
        "ResumeData",
        JSON.stringify(updatedResumeData)
      );

      setApplied(true);
      alert("Improved experience added to resume!");
      return;
    }

    // CERTIFICATIONS
    if (activeOption === "certifications") {
      updatedResumeData.certifications = finalResult;

      localStorage.setItem(
        "ResumeData",
        JSON.stringify(updatedResumeData)
      );

      setApplied(true);
      alert("Improved certifications added to resume!");
      return;
    }

    // ACHIEVEMENTS
    if (activeOption === "achievements") {
      updatedResumeData.achievements = finalResult;

      localStorage.setItem(
        "ResumeData",
        JSON.stringify(updatedResumeData)
      );

      setApplied(true);
      alert("Improved achievements added to resume!");
      return;
    }

    // COMPLETE RESUME IMPROVEMENT
    if (activeOption === "resume") {
      try {
        const improvedResume = JSON.parse(finalResult);

        // Update professional summary
        if (
          typeof improvedResume.summary === "string" &&
          improvedResume.summary.trim()
        ) {
          localStorage.setItem(
            "AISummary",
            improvedResume.summary.trim()
          );
        }

        // Update Skills
        if (
          typeof improvedResume.skills === "string" &&
          improvedResume.skills.trim()
        ) {
          updatedResumeData.skills =
            improvedResume.skills.trim();
        }

        // Update Projects
        if (
          typeof improvedResume.projects === "string" &&
          improvedResume.projects.trim()
        ) {
          updatedResumeData.projects =
            improvedResume.projects.trim();
        }

        // Update Experience
        if (
          typeof improvedResume.experience === "string" &&
          improvedResume.experience.trim()
        ) {
          updatedResumeData.experience =
            improvedResume.experience.trim();
        }

        // Update Certifications
        if (
          typeof improvedResume.certifications === "string" &&
          improvedResume.certifications.trim()
        ) {
          updatedResumeData.certifications =
            improvedResume.certifications.trim();
        }

        // Update Achievements
        if (
          typeof improvedResume.achievements === "string" &&
          improvedResume.achievements.trim()
        ) {
          updatedResumeData.achievements =
            improvedResume.achievements.trim();
        }

        localStorage.setItem(
          "ResumeData",
          JSON.stringify(updatedResumeData)
        );

        setApplied(true);

        alert(
          "Complete AI improved resume applied successfully!"
        );

        return;
      } catch (error) {
        console.error("Resume apply error:", error);

        alert(
          "Unable to apply the complete resume. Please generate it again."
        );

        return;
      }
    }
  };

  const handleContinue = () => {
    navigate("/templates");
  };

  const handleSaveAndExit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="ai-page">
      <nav className="ai-navbar">
        <div
          className="ai-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span>AI</span> Resume
        </div>

        <div className="ai-step"> Step 4 of 6 </div>

        <button
          className="ai-exit"
          onClick={handleSaveAndExit}
        >
          Save & Exit
        </button>
      </nav>

      <div className="ai-progress-container">
        <div className="ai-progress-info">
          <span>AI Assistance</span>
          <span>67% Complete</span>
        </div>

        <div className="ai-progress-bar">
          <div className="ai-progress-fill"></div>
        </div>
      </div>

      <main className="ai-main">
        <div className="ai-heading">
          <p className="ai-label"> RESUME BUILDER </p>

          <h1>
            Make your resume
            <span> stand out with AI</span>
          </h1>

          <p>
            Use AI-powered suggestions to improve your resume
            and make your content more professional.
          </p>
        </div>

        <div className="ai-card">
          <div className="ai-card-header">
            <div className="ai-avatar"> 🤖 </div>

            <div>
              <h2>AI Resume Assistant</h2>
              <p>
                Choose an option below to improve your resume.
              </p>
            </div>

            <div className="ai-status">
              <span></span>
              {loading ? "Generating..." : "Ready"}
            </div>
          </div>

          <div className="ai-options">
            {/* SUMMARY */}
            <button
              className={`ai-option ${
                activeOption === "summary" ? "selected" : ""
              }`}
              onClick={generateSummary}
              disabled={loading}
            >
              <div className="option-icon purple">✨</div>

              <div className="option-content">
                <h3>Generate Professional Summary</h3>
                <p>
                  Create a strong professional introduction
                  for your resume.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>

            {/* PROJECT */}
            <button
              className={`ai-option ${
                activeOption === "project" ? "selected" : ""
              }`}
              onClick={improveProject}
              disabled={loading}
            >
              <div className="option-icon blue">🚀</div>

              <div className="option-content">
                <h3>Improve Project Description</h3>
                <p>
                  Make your project descriptions more
                  professional and impactful.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>

            {/* SKILLS */}
            <button
              className={`ai-option ${
                activeOption === "skills" ? "selected" : ""
              }`}
              onClick={suggestSkills}
              disabled={loading}
            >
              <div className="option-icon green">💡</div>

              <div className="option-content">
                <h3>Suggest Skills</h3>
                <p>
                  Get relevant technical skills based on
                  your resume and projects.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>

            {/* EXPERIENCE */}
            <button
              className={`ai-option ${
                activeOption === "experience" ? "selected" : ""
              }`}
              onClick={improveExperience}
              disabled={loading}
            >
              <div className="option-icon blue">💼</div>

              <div className="option-content">
                <h3>Improve Experience</h3>
                <p>
                  Improve your internship or work experience
                  using professional wording.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>

            {/* CERTIFICATIONS */}
            <button
              className={`ai-option ${
                activeOption === "certifications"
                  ? "selected"
                  : ""
              }`}
              onClick={improveCertifications}
              disabled={loading}
            >
              <div className="option-icon purple">📜</div>

              <div className="option-content">
                <h3>Improve Certifications</h3>
                <p>
                  Present your certifications clearly and
                  professionally.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>

            {/* ACHIEVEMENTS */}
            <button
              className={`ai-option ${
                activeOption === "achievements"
                  ? "selected"
                  : ""
              }`}
              onClick={improveAchievements}
              disabled={loading}
            >
              <div className="option-icon green">🏆</div>

              <div className="option-content">
                <h3>Improve Achievements</h3>
                <p>
                  Make your achievements concise,
                  professional and impactful.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>

            {/* FULL RESUME */}
            <button
              className={`ai-option ${
                activeOption === "resume" ? "selected" : ""
              }`}
              onClick={improveResume}
              disabled={loading}
            >
              <div className="option-icon orange">📄</div>

              <div className="option-content">
                <h3>Improve Resume</h3>
                <p>
                  Improve your complete resume content with
                  professional and ATS-friendly wording.
                </p>
              </div>

              <span className="option-arrow">→</span>
            </button>
          </div>

          <div className="ai-result">
            <div className="result-header">
              <div>
                <h2>AI Generated Result</h2>

                <p>
                  Review the result and apply it to your resume.
                </p>
              </div>

              {result && !loading && (
                <span className="generated-badge">
                  {applied ? "✓ Applied" : "✓ Generated"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="ai-loading">
                <div className="loading-spinner"></div>

                <div>
                  <strong>AI is generating...</strong>

                  <p>
                    Creating professional content for your
                    resume.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  value={result}
                  onChange={(e) => {
                    setResult(e.target.value);
                    setApplied(false);
                  }}
                  placeholder="Select an AI option above to generate content..."
                />

                {result && (
                  <button
                    type="button"
                    className="ai-apply-btn"
                    onClick={handleApplyToResume}
                  >
                    {applied
                      ? "✓ Applied to Resume"
                      : activeOption === "resume"
                      ? "Apply Complete Resume"
                      : "Apply to Resume"}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="ai-tip">
            <div className="tip-ai-icon"> ✨ </div>

            <div>
              <strong>AI Tip</strong>

              <p>
                Review and edit the generated content before
                applying it to your resume.
              </p>
            </div>
          </div>

          <div className="ai-actions">
            <button
              className="ai-back-btn"
              onClick={() => navigate("/resume-details")}
            >
              ← Back
            </button>

            <button
              className="ai-continue-btn"
              onClick={handleContinue}
            >
              Continue to Templates →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIAssistance;