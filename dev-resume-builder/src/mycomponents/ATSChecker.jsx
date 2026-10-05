import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ATSChecker.css";

function ATSChecker() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  // ===============================
  // FETCH USER RESUMES
  // ===============================
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
          throw new Error(
            data.message || "Unable to load resumes"
          );
        }

        setResumes(data.resumes || []);
      } catch (error) {
        console.error("ATS Resume Fetch Error:", error);
        alert("Unable to load your resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [navigate]);

  // ===============================
  // CHECK IF VALUE HAS CONTENT
  // ===============================
  const hasContent = (value) => {
    if (!value) return false;

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      return Object.values(value).some((item) =>
        hasContent(item)
      );
    }

    return false;
  };

  // ===============================
  // GET TEXT FROM OBJECT
  // ===============================
  const getAllText = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(getAllText).join(" ");
    }

    if (typeof value === "object") {
      return Object.values(value)
        .map(getAllText)
        .join(" ");
    }

    return "";
  };

  // ===============================
  // ATS CHECK
  // ===============================
  const handleCheckATS = () => {
    if (!selectedResumeId) {
      alert("Please select a resume");
      return;
    }

    const resume = resumes.find(
      (item) =>
        String(item._id || item.id) ===
        String(selectedResumeId)
    );

    if (!resume) {
      alert("Resume not found");
      return;
    }

    setChecking(true);

    try {
      const personal = resume.personalData || {};
      const education = resume.educationData || {};
      const data = resume.resumeData || {};

      let score = 0;

      const strengths = [];
      const issues = [];
      const suggestions = [];

      // ===============================
      // CONTACT INFORMATION - 15
      // ===============================
      const hasName =
        hasContent(personal.name) ||
        hasContent(personal.fullName);

      const hasEmail = hasContent(personal.email);
      const hasPhone = hasContent(personal.phone);

      if (hasName) {
        score += 5;
        strengths.push("Name is included");
      } else {
        issues.push("Name is missing");
      }

      if (hasEmail) {
        score += 5;
        strengths.push("Email address is included");
      } else {
        issues.push("Email address is missing");
      }

      if (hasPhone) {
        score += 5;
        strengths.push("Phone number is included");
      } else {
        issues.push("Phone number is missing");
      }

      // ===============================
      // SUMMARY - 15
      // ===============================
      const summary =
        data.summary ||
        resume.aiSummary ||
        "";

      if (hasContent(summary)) {
        score += 15;
        strengths.push(
          "Professional summary is included"
        );
      } else {
        issues.push(
          "Professional summary is missing"
        );

        suggestions.push(
          "Add a concise professional summary with relevant skills and career focus."
        );
      }

      // ===============================
      // SKILLS - 15
      // ===============================
      const skills = data.skills || "";

      if (hasContent(skills)) {
        score += 15;
        strengths.push("Skills section is included");
      } else {
        issues.push("Skills section is missing");

        suggestions.push(
          "Add relevant technical and professional skills."
        );
      }

      // ===============================
      // EDUCATION - 15
      // ===============================
      if (hasContent(education)) {
        score += 15;
        strengths.push("Education information is included");
      } else {
        issues.push("Education information is missing");

        suggestions.push("Add education details such as degree, institution, and graduation information.");
      }

      // ===============================
      // EXPERIENCE - 15
      // ===============================
      const experience =
        data.experience || "";

      if (hasContent(experience)) {
        score += 15;
        strengths.push("Experience section is included");
      } else {
        issues.push("Experience section is missing");

        suggestions.push("Add internships, work experience, or relevant practical experience when available.");
      }

      // ===============================
      // PROJECTS - 15
      // ===============================
      const projects =
        data.projects || "";

      if (hasContent(projects)) {
        score += 15;
        strengths.push("Projects section is included");
      } else {
        issues.push("Projects section is missing");

        suggestions.push("Add relevant projects with technologies used and your contribution.");
      }

      // ===============================
      // CERTIFICATIONS / ACHIEVEMENTS - 5
      // ===============================
      const certifications =
        data.certifications || "";

      const achievements =
        data.achievements || "";

      if (
        hasContent(certifications) ||
        hasContent(achievements)
      ) {
        score += 5;
        strengths.push("Certifications or achievements are included");
      } else {
        suggestions.push("Consider adding relevant certifications or achievements if available.");
      }

      // ===============================
      // ACTION VERBS - 5
      // ===============================
      const resumeText = getAllText({
        summary,
        skills,
        experience,
        projects,
        certifications,
        achievements,
      }).toLowerCase();

      const actionVerbs = [
        "developed",
        "created",
        "built",
        "designed",
        "implemented",
        "managed",
        "led",
        "integrated",
        "analyzed",
        "collaborated",
        "improved",
        "optimized",
        "tested",
        "maintained",
      ];

      const hasActionVerb = actionVerbs.some(
        (verb) => resumeText.includes(verb)
      );

      if (hasActionVerb) {
        score += 5;

        strengths.push(
          "Resume uses action-oriented language"
        );
      } else {
        suggestions.push("Use strong action verbs such as Developed, Built, Implemented, Designed, or Collaborated.");
      }

      // Ensure maximum 100
      score = Math.min(score, 100);

      // ===============================
      // SCORE STATUS
      // ===============================
      let status = "";

      if (score >= 85) {
        status = "Strong ATS Structure";
      } else if (score >= 70) {
        status = "Good ATS Structure";
      } else if (score >= 50) {
        status = "Needs Improvement";
      } else {
        status = "ATS Optimization Required";
      }

      setResult({
        score,
        status,
        strengths,
        issues,
        suggestions,
        resumeTitle:
          resume.title || "Untitled Resume",
      });
    } catch (error) {
      console.error("ATS Check Error:", error);
      alert("Unable to analyze resume");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="ats-page">
        <p className="ats-loading"> Loading resumes... </p>
      </div>
    );
  }

  return (
    <div className="ats-page">

      {/* NAVBAR */}
      <nav className="ats-navbar">

        <div className="ats-logo" onClick={() => navigate("/dashboard")}>
          <span>AI</span> Resume
        </div>

        <button className="ats-back-btn" onClick={() => navigate("/dashboard")}> ← Dashboard </button>

      </nav>


      <main className="ats-container">

        {/* HEADER */}
        <section className="ats-header">

          <p className="ats-small-title"> ATS RESUME CHECKER </p>

          <h1>
            Check Your Resume
            <span> ATS Score</span>
          </h1>

          <p>
            Analyze your saved resume for important
            ATS-friendly sections and resume structure.
          </p>

        </section>


        {/* SELECT RESUME */}
        <section className="ats-check-card">

          <h2>Select Resume</h2>

          {resumes.length === 0 ? (
            <div className="ats-empty">

              <p> You don't have any saved resumes yet. </p>

              <button onClick={() => navigate("/create-resume")}> Create Resume </button>

            </div>
          ) : (
            <>
              <select value={selectedResumeId} onChange={(e) => {setSelectedResumeId(e.target.value);

                  setResult(null);
                }}
              >
                <option value="">
                  Choose a resume
                </option>

                {resumes.map((resume) => (
                  <option
                    key={resume._id || resume.id}
                    value={resume._id || resume.id}
                  >
                    {resume.title || "Untitled Resume"}
                  </option>
                ))}

              </select>

              <button className="check-ats-btn" onClick={handleCheckATS} disabled={checking}>
                {checking
                  ? "Checking..."
                  : "Check ATS Score"}
              </button>
            </>
          )}

        </section>


        {/* RESULTS */}
        {result && (
          <section className="ats-results">

            {/* SCORE */}
            <div className="ats-score-card">

              <div className="ats-score-circle">
                <strong>
                  {result.score}
                </strong>

                <span>/100</span>
              </div>

              <div>
                <p>ATS Score</p>

                <h2>{result.status}</h2>

                <span>
                  {result.resumeTitle}
                </span>
              </div>

            </div>


            {/* STRENGTHS */}
            <div className="ats-result-card">

              <h2>✓ Strengths</h2>

              {result.strengths.length > 0 ? (
                <ul>
                  {result.strengths.map((item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  No major strengths detected.
                </p>
              )}

            </div>


            {/* ISSUES */}
            <div className="ats-result-card">

              <h2>⚠ Issues</h2>

              {result.issues.length > 0 ? (
                <ul>
                  {result.issues.map((item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  No missing core sections detected.
                </p>
              )}

            </div>


            {/* SUGGESTIONS */}
            <div className="ats-result-card">

              <h2>💡 Suggestions</h2>

              {result.suggestions.length > 0 ? (
                <ul>
                  {result.suggestions.map((item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Your resume contains the main
                  ATS-friendly sections.
                </p>
              )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default ATSChecker;