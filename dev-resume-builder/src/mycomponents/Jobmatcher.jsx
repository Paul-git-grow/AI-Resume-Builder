import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobmatcher.css";

function JobMatcher() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // ==========================================
  // FETCH SAVED RESUMES
  // ==========================================
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/resumes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUserId");
            navigate("/login");
            return;
          }

          throw new Error(
            data.message || "Unable to load resumes"
          );
        }

        setResumes(data.resumes || []);
      } catch (error) {
        console.error("Job Matcher Resume Error:", error);
        alert("Unable to load your resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [navigate]);

  // ==========================================
  // CONVERT ANY VALUE INTO TEXT
  // ==========================================
  const getAllText = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
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

  // ==========================================
  // NORMALIZE TEXT
  // ==========================================
  const normalizeText = (text) => {
    return String(text || "")
      .toLowerCase()
      .replace(/react\.js/g, "react")
      .replace(/node\.js/g, "node")
      .replace(/express\.js/g, "express")
      .replace(/next\.js/g, "nextjs")
      .replace(/vue\.js/g, "vue")
      .replace(/restful apis/g, "rest api")
      .replace(/restful api/g, "rest api")
      .replace(/rest apis/g, "rest api")
      .replace(/[^a-z0-9+#.\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ==========================================
  // SKILLS / KEYWORDS WE CAN DETECT
  // ==========================================
  const keywordLibrary = [
    // Programming
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "c++",
    "c#",
    "php",
    "ruby",
    "go",
    "kotlin",
    "swift",

    // Frontend
    "html",
    "css",
    "react",
    "angular",
    "vue",
    "nextjs",
    "bootstrap",
    "tailwind",
    "redux",

    // Backend
    "node",
    "express",
    "django",
    "flask",
    "spring",
    "spring boot",
    "laravel",

    // Database
    "mongodb",
    "mysql",
    "postgresql",
    "sql",
    "firebase",
    "redis",
    "oracle",

    // API
    "rest api",
    "graphql",
    "api integration",

    // Cloud / DevOps
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "jenkins",
    "ci/cd",
    "linux",

    // Development tools
    "git",
    "github",
    "gitlab",
    "postman",
    "jira",
    "figma",

    // AI / Data
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "generative ai",
    "genai",
    "rag",
    "nlp",
    "data analysis",
    "data analytics",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "power bi",
    "tableau",

    // Concepts
    "mern",
    "full stack",
    "frontend",
    "backend",
    "responsive design",
    "object oriented programming",
    "oop",
    "data structures",
    "algorithms",
    "database management",

    // Professional skills
    "communication",
    "teamwork",
    "problem solving",
    "leadership",
    "collaboration",
    "time management",
    "analytical skills",
    "project management",
  ];

  // ==========================================
  // CHECK IF KEYWORD EXISTS
  // ==========================================
  const containsKeyword = (text, keyword) => {
    const normalizedText = normalizeText(text);
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedText || !normalizedKeyword) {
      return false;
    }

    // Special handling for short technology names
    // to avoid accidental partial matches.
    if (
      ["c", "c++", "c#", "go"].includes(normalizedKeyword)
    ) {
      const escapedKeyword = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(
        `(^|\\s)${escapedKeyword}(?=\\s|$)`,
        "i"
      );

      return regex.test(normalizedText);
    }

    return normalizedText.includes(normalizedKeyword);
  };

  // ==========================================
  // EXTRACT JOB KEYWORDS
  // ==========================================
  const extractJobKeywords = (jobText) => {
    return keywordLibrary.filter((keyword) =>
      containsKeyword(jobText, keyword)
    );
  };

  // ==========================================
  // REMOVE DUPLICATES
  // ==========================================
  const uniqueItems = (items) => {
    return [...new Set(items)];
  };

  // ==========================================
  // ANALYZE JOB MATCH
  // ==========================================
  const handleAnalyze = () => {
    if (!selectedResumeId) {
      alert("Please select a resume");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste the job description");
      return;
    }

    const selectedResume = resumes.find(
      (resume) =>
        String(resume._id || resume.id) ===
        String(selectedResumeId)
    );

    if (!selectedResume) {
      alert("Selected resume not found");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // ------------------------------------------
      // BUILD COMPLETE RESUME TEXT
      // ------------------------------------------
      const resumeText = getAllText({
        personalData: selectedResume.personalData || {},
        educationData: selectedResume.educationData || {},
        resumeData: selectedResume.resumeData || {},
        aiSummary: selectedResume.aiSummary || "",
      });

      // ------------------------------------------
      // EXTRACT IMPORTANT JD KEYWORDS
      // ------------------------------------------
      const jobKeywords = extractJobKeywords(jobDescription);

      // ------------------------------------------
      // MATCH AGAINST RESUME
      // ------------------------------------------
      const matchedKeywords = [];
      const missingKeywords = [];

      jobKeywords.forEach((keyword) => {
        if (containsKeyword(resumeText, keyword)) {
          matchedKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });

      const finalMatched =
        uniqueItems(matchedKeywords);

      const finalMissing =
        uniqueItems(missingKeywords);

      // ------------------------------------------
      // MATCH SCORE
      // ------------------------------------------
      let matchScore = 0;

      if (jobKeywords.length > 0) {
        matchScore = Math.round(
          (finalMatched.length / jobKeywords.length) * 100
        );
      }

      // ------------------------------------------
      // MATCH STATUS
      // ------------------------------------------
      let matchStatus = "";

      if (jobKeywords.length === 0) {
        matchStatus = "Limited Keyword Data";
      } else if (matchScore >= 80) {
        matchStatus = "Strong Keyword Match";
      } else if (matchScore >= 60) {
        matchStatus = "Good Keyword Match";
      } else if (matchScore >= 40) {
        matchStatus = "Moderate Keyword Match";
      } else {
        matchStatus = "Low Keyword Match";
      }

      // ------------------------------------------
      // SUGGESTIONS
      // ------------------------------------------
      const suggestions = [];

      if (jobKeywords.length === 0) {
        suggestions.push(
          "The job description did not contain enough recognized skills for a reliable keyword comparison."
        );
      }

      if (finalMissing.length > 0) {
        suggestions.push(
          "Review the missing keywords and add only the skills or technologies you genuinely have experience with."
        );
      }

      if (finalMatched.length > 0) {
        suggestions.push(
          "Keep relevant matched skills visible in your summary, skills, projects, or experience sections where appropriate."
        );
      }

      const resumeData =
        selectedResume.resumeData || {};

      if (!getAllText(resumeData.experience).trim()) {
        suggestions.push("Add relevant work or internship experience if available.");
      }

      if (!getAllText(resumeData.projects).trim()) {
        suggestions.push(
          "Add relevant projects that demonstrate skills required by the job."
        );
      }

      if (!getAllText(resumeData.skills).trim()) {
        suggestions.push(
          "Add a dedicated skills section with relevant technical skills."
        );
      }

      setResult({
        resumeTitle:
          selectedResume.title || "Untitled Resume",

        matchScore,
        matchStatus,

        totalKeywords: jobKeywords.length,

        matchedKeywords: finalMatched,
        missingKeywords: finalMissing,

        suggestions: uniqueItems(suggestions),
      });
    } catch (error) {
      console.error("Job Match Analysis Error:", error);

      alert(
        "Unable to analyze the resume and job description"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // CLEAR ANALYSIS
  // ==========================================
  const handleClear = () => {
    setSelectedResumeId("");
    setJobDescription("");
    setResult(null);
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="job-matcher-page">
        <p className="job-matcher-loading">
          Loading resumes...
        </p>
      </div>
    );
  }

  return (
    <div className="job-matcher-page">

      {/* ======================================
          NAVBAR
      ====================================== */}
      <nav className="job-matcher-navbar">

        <div className="job-matcher-logo" onClick={() => navigate("/dashboard")}>
          <span>AI</span> Resume
        </div>

        <button className="job-matcher-back-btn" onClick={() => navigate("/dashboard")}> ← Dashboard </button>

      </nav>


      <main className="job-matcher-container">

        {/* ======================================
            HEADER
        ====================================== */}
        <section className="job-matcher-header">

          <p className="job-matcher-small-title"> JOB MATCH ANALYZER </p>

          <h1>
            Match Your Resume With a
            <span> Job Description</span>
          </h1>

          <p>
            Compare your saved resume with a job
            description to identify relevant matched
            skills and potential missing keywords.
          </p>

        </section>


        {/* ======================================
            ANALYZER CARD
        ====================================== */}
        <section className="job-matcher-card">

          <div className="job-matcher-field">

            <label>
              Select Resume
            </label>

            <select value={selectedResumeId} onChange={(e) => {
                setSelectedResumeId(e.target.value);
                setResult(null);
              }}
            >
              <option value="">
                Choose a saved resume
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

          </div>


          <div className="job-matcher-field">

            <div className="job-description-label">

              <label>
                Job Description
              </label>

              <span>
                {jobDescription.length} characters
              </span>

            </div>

            <textarea
              rows="12"
              value={jobDescription}
              placeholder="Paste the complete job description here..."
              onChange={(e) => {
                setJobDescription(e.target.value);
                setResult(null);
              }}
            />

          </div>


          <div className="job-matcher-actions">

            <button
              className="job-match-btn"
              onClick={handleAnalyze}
              disabled={
                analyzing ||
                !selectedResumeId ||
                !jobDescription.trim()
              }
            >
              {analyzing
                ? "Analyzing..."
                : "Analyze Job Match"}
            </button>

            <button className="job-clear-btn" onClick={handleClear}> Clear </button>

          </div>

        </section>


        {/* ======================================
            NO RESUMES
        ====================================== */}
        {resumes.length === 0 && (
          <section className="job-matcher-empty">

            <h2>No Saved Resumes</h2>

            <p>
              Create and save a resume before using
              the job match analyzer.
            </p>

            <button onClick={() =>  navigate("/create-resume")}> Create Resume </button>

          </section>
        )}


        {/* ======================================
            RESULTS
        ====================================== */}
        {result && (
          <section className="job-match-results">

            {/* SCORE */}
            <div className="job-match-score-card">

              <div className="job-match-score-circle">

                <strong>
                  {result.matchScore}
                </strong>

                <span>%</span>

              </div>

              <div className="job-match-score-info">

                <p> Resume Match </p>

                <h2> {result.matchStatus} </h2>

                <span>
                  {result.resumeTitle}
                </span>

              </div>

            </div>


            {/* OVERVIEW */}
            <div className="job-match-overview">

              <div className="job-match-stat">

                <strong>
                  {result.totalKeywords}
                </strong>

                <span>
                  Job Keywords
                </span>

              </div>


              <div className="job-match-stat">

                <strong>
                  {result.matchedKeywords.length}
                </strong>

                <span>
                  Matched
                </span>

              </div>


              <div className="job-match-stat">

                <strong>
                  {result.missingKeywords.length}
                </strong>

                <span>
                  Missing
                </span>

              </div>

            </div>


            {/* MATCHED KEYWORDS */}
            <div className="job-match-result-card">

              <h2> ✓ Matched Skills & Keywords </h2>

              {result.matchedKeywords.length > 0 ? (

                <div className="keyword-list matched">

                  {result.matchedKeywords.map(
                    (keyword) => (
                      <span key={keyword}>
                        {keyword}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <p>
                  No recognized job keywords were
                  found in the selected resume.
                </p>

              )}

            </div>


            {/* MISSING KEYWORDS */}
            <div className="job-match-result-card">

              <h2> ⚠ Missing Skills & Keywords </h2>

              {result.missingKeywords.length > 0 ? (

                <>
                  <p className="job-match-warning">
                    These keywords appear in the job
                    description but were not detected in
                    your resume. Add them only if they
                    accurately represent your skills or
                    experience.
                  </p>

                  <div className="keyword-list missing">

                    {result.missingKeywords.map(
                      (keyword) => (
                        <span key={keyword}>
                          {keyword}
                        </span>
                      )
                    )}

                  </div>
                </>

              ) : (

                <p> No missing recognized keywords detected. </p>

              )}

            </div>


            {/* SUGGESTIONS */}
            <div className="job-match-result-card">

              <h2> 💡 Improvement Suggestions </h2>

              {result.suggestions.length > 0 ? (

                <ul>
                  {result.suggestions.map(
                    (suggestion, index) => (
                      <li key={index}>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>

              ) : (

                <p> No additional suggestions available. </p>

              )}

            </div>


            {/* NOTE */}
            <div className="job-match-note">
              <strong>Note:</strong>{" "}
              Match percentage is based on recognized
              keyword overlap between the job description
              and your saved resume. It is not a hiring
              probability or an employer's ATS score.
            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default JobMatcher;