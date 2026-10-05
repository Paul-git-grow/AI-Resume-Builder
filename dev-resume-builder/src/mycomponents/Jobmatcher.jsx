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

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
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
      .replace(/reactjs/g, "react")
      .replace(/node\.js/g, "node")
      .replace(/nodejs/g, "node")
      .replace(/express\.js/g, "express")
      .replace(/next\.js/g, "nextjs")
      .replace(/vue\.js/g, "vue")
      .replace(/restful apis/g, "rest api")
      .replace(/restful api/g, "rest api")
      .replace(/rest apis/g, "rest api")
      .replace(/amazon web services/g, "aws")
      .replace(/google cloud platform/g, "gcp")
      .replace(/continuous integration/g, "ci/cd")
      .replace(/continuous deployment/g, "ci/cd")
      .replace(/machine-learning/g, "machine learning")
      .replace(/problem-solving/g, "problem solving")
      .replace(/[^a-z0-9+#./\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ==========================================
  // UNIQUE ITEMS
  // ==========================================

  const uniqueItems = (items) => {
    return [...new Set(items.filter(Boolean))];
  };

  // ==========================================
  // SKILL LIBRARIES
  // ==========================================

  const technicalSkills = [
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

    "html",
    "css",
    "react",
    "angular",
    "vue",
    "nextjs",
    "bootstrap",
    "tailwind",
    "redux",

    "node",
    "express",
    "django",
    "flask",
    "spring",
    "spring boot",
    "laravel",

    "mongodb",
    "mysql",
    "postgresql",
    "sql",
    "firebase",
    "redis",
    "oracle",

    "rest api",
    "graphql",
    "api integration",

    "artificial intelligence",
    "machine learning",
    "deep learning",
    "generative ai",
    "genai",
    "rag",
    "nlp",

    "data analysis",
    "data analytics",
    "data science",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "power bi",
    "tableau",

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
  ];

  const toolSkills = [
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "jenkins",
    "ci/cd",
    "linux",
    "git",
    "github",
    "gitlab",
    "postman",
    "jira",
    "figma",
    "vercel",
    "netlify",
    "render",
  ];

  const professionalSkills = [
    "communication",
    "teamwork",
    "problem solving",
    "leadership",
    "collaboration",
    "time management",
    "analytical skills",
    "project management",
    "critical thinking",
    "decision making",
    "adaptability",
  ];

  const roleKeywords = [
    "software developer",
    "software engineer",
    "frontend developer",
    "front end developer",
    "frontend engineer",
    "backend developer",
    "back end developer",
    "backend engineer",
    "full stack developer",
    "fullstack developer",
    "full stack engineer",
    "web developer",
    "react developer",
    "node developer",
    "python developer",
    "java developer",
    "mobile developer",
    "data analyst",
    "data scientist",
    "data engineer",
    "machine learning engineer",
    "ai engineer",
    "devops engineer",
    "cloud engineer",
    "ui developer",
    "ux designer",
    "ui ux designer",
    "business analyst",
    "project manager",
    "product manager",
  ];

  // ==========================================
  // CHECK KEYWORD
  // ==========================================

  const containsKeyword = (text, keyword) => {
    const normalizedText = normalizeText(text);
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedText || !normalizedKeyword) {
      return false;
    }

    const shortKeywords = [
      "c",
      "c++",
      "c#",
      "go",
    ];

    if (shortKeywords.includes(normalizedKeyword)) {
      const escaped = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(
        `(^|\\s)${escaped}(?=\\s|$)`,
        "i"
      );

      return regex.test(normalizedText);
    }

    return normalizedText.includes(normalizedKeyword);
  };

  // ==========================================
  // EXTRACT KEYWORDS FROM LIBRARY
  // ==========================================

  const extractKeywords = (text, library) => {
    return uniqueItems(
      library.filter((keyword) =>
        containsKeyword(text, keyword)
      )
    );
  };

  // ==========================================
  // GET MATCH DATA
  // ==========================================

  const getMatchData = (
    jobText,
    resumeText,
    library
  ) => {
    const required = extractKeywords(
      jobText,
      library
    );

    const matched = required.filter((keyword) =>
      containsKeyword(resumeText, keyword)
    );

    const missing = required.filter(
      (keyword) =>
        !containsKeyword(resumeText, keyword)
    );

    return {
      required,
      matched,
      missing,
    };
  };

  // ==========================================
  // CALCULATE CATEGORY SCORE
  // ==========================================

  const calculateCategoryScore = (
    matchedCount,
    requiredCount,
    weight
  ) => {
    if (requiredCount === 0) {
      return null;
    }

    return (
      (matchedCount / requiredCount) *
      weight
    );
  };

  // ==========================================
  // EXTRACT IMPORTANT GENERAL JD TERMS
  // ==========================================

  const extractGeneralKeywords = (text) => {
    const normalized = normalizeText(text);

    const stopWords = new Set([
      "the",
      "and",
      "for",
      "with",
      "you",
      "your",
      "our",
      "are",
      "will",
      "this",
      "that",
      "from",
      "have",
      "has",
      "had",
      "job",
      "role",
      "work",
      "working",
      "team",
      "candidate",
      "looking",
      "required",
      "requirements",
      "preferred",
      "responsibilities",
      "responsibility",
      "skills",
      "skill",
      "experience",
      "years",
      "year",
      "knowledge",
      "ability",
      "strong",
      "good",
      "excellent",
      "using",
      "use",
      "used",
      "including",
      "such",
      "other",
      "about",
      "into",
      "within",
      "across",
      "their",
      "they",
      "them",
      "who",
      "what",
      "when",
      "where",
      "which",
      "while",
      "also",
      "can",
      "should",
      "must",
      "would",
      "could",
      "may",
      "we",
      "to",
      "of",
      "in",
      "on",
      "at",
      "as",
      "an",
      "a",
      "or",
      "be",
      "is",
      "it",
      "by",
    ]);

    const words = normalized
      .split(/\s+/)
      .map((word) =>
        word.replace(/^[-./]+|[-./]+$/g, "")
      )
      .filter(
        (word) =>
          word.length >= 4 &&
          !stopWords.has(word) &&
          !/^\d+$/.test(word)
      );

    const frequencies = {};

    words.forEach((word) => {
      frequencies[word] =
        (frequencies[word] || 0) + 1;
    });

    return Object.entries(frequencies)
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }

        return a[0].localeCompare(b[0]);
      })
      .slice(0, 20)
      .map(([word]) => word);
  };

  // ==========================================
  // EXPERIENCE / RESPONSIBILITY MATCH
  // ==========================================

  const responsibilityTerms = [
    "develop",
    "developed",
    "developing",
    "design",
    "designed",
    "designing",
    "build",
    "built",
    "building",
    "implement",
    "implemented",
    "implementing",
    "integrate",
    "integrated",
    "integrating",
    "test",
    "tested",
    "testing",
    "deploy",
    "deployed",
    "deploying",
    "maintain",
    "maintained",
    "maintaining",
    "optimize",
    "optimized",
    "optimizing",
    "analyze",
    "analyzed",
    "analyzing",
    "manage",
    "managed",
    "managing",
    "lead",
    "led",
    "collaborate",
    "collaborated",
    "troubleshoot",
    "debug",
    "debugging",
    "automate",
    "automated",
    "monitor",
    "documentation",
    "architecture",
    "performance",
    "security",
    "scalable",
    "responsive",
  ];

  // ==========================================
  // EDUCATION MATCH
  // ==========================================

  const educationTerms = [
    "bachelor",
    "master",
    "degree",
    "diploma",
    "b.tech",
    "btech",
    "m.tech",
    "mtech",
    "b.e",
    "m.e",
    "b.sc",
    "m.sc",
    "computer science",
    "information technology",
    "engineering",
  ];

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
      const personalData =
        selectedResume.personalData || {};

      const educationData =
        selectedResume.educationData || {};

      const resumeData =
        selectedResume.resumeData || {};

      const summaryText = getAllText(
        resumeData.summary ||
          selectedResume.aiSummary ||
          ""
      );

      const skillsText = getAllText(
        resumeData.skills || ""
      );

      const experienceText = getAllText(
        resumeData.experience || ""
      );

      const projectsText = getAllText(
        resumeData.projects || ""
      );

      const educationText = getAllText(
        educationData
      );

      const completeResumeText = getAllText({
        personalData,
        educationData,
        resumeData,
        aiSummary:
          selectedResume.aiSummary || "",
      });

      // ========================================
      // 1. TECHNICAL SKILLS MATCH — 35
      // ========================================

      const technicalMatch = getMatchData(
        jobDescription,
        completeResumeText,
        technicalSkills
      );

      // ========================================
      // 2. RESPONSIBILITY MATCH — 20
      // ========================================

      const responsibilityMatch =
        getMatchData(
          jobDescription,
          `${experienceText} ${projectsText}`,
          responsibilityTerms
        );

      // ========================================
      // 3. PROJECT RELEVANCE — 15
      // ========================================

      const jobTechnicalSkills =
        technicalMatch.required;

      const projectMatchedSkills =
        jobTechnicalSkills.filter((skill) =>
          containsKeyword(
            projectsText,
            skill
          )
        );

      let projectScore = 0;

      if (jobTechnicalSkills.length > 0) {
        projectScore =
          (projectMatchedSkills.length /
            jobTechnicalSkills.length) *
          15;
      } else if (
        projectsText.trim().length > 0
      ) {
        projectScore = 7.5;
      }

      // ========================================
      // 4. ROLE RELEVANCE — 10
      // ========================================

      const roleMatch = getMatchData(
        jobDescription,
        `${summaryText} ${experienceText} ${projectsText}`,
        roleKeywords
      );

      // ========================================
      // 5. TOOLS / PLATFORM MATCH — 10
      // ========================================

      const toolsMatch = getMatchData(
        jobDescription,
        completeResumeText,
        toolSkills
      );

      // ========================================
      // 6. EDUCATION MATCH — 5
      // ========================================

      const educationMatch = getMatchData(
        jobDescription,
        educationText,
        educationTerms
      );

      // ========================================
      // 7. OVERALL KEYWORD COVERAGE — 5
      // ========================================

      const generalJobKeywords =
        extractGeneralKeywords(
          jobDescription
        );

      const generalMatched =
        generalJobKeywords.filter((keyword) =>
          containsKeyword(
            completeResumeText,
            keyword
          )
        );

      // ========================================
      // CATEGORY SCORES
      // ========================================

      const categories = [];

      const technicalScore =
        calculateCategoryScore(
          technicalMatch.matched.length,
          technicalMatch.required.length,
          35
        );

      if (technicalScore !== null) {
        categories.push({
          score: technicalScore,
          weight: 35,
        });
      }

      const responsibilityScore =
        calculateCategoryScore(
          responsibilityMatch.matched.length,
          responsibilityMatch.required.length,
          20
        );

      if (responsibilityScore !== null) {
        categories.push({
          score: responsibilityScore,
          weight: 20,
        });
      }

      // Projects are meaningful only when
      // the resume actually has project content.
      if (
        jobTechnicalSkills.length > 0 ||
        projectsText.trim()
      ) {
        categories.push({
          score: projectScore,
          weight: 15,
        });
      }

      const roleScore =
        calculateCategoryScore(
          roleMatch.matched.length,
          roleMatch.required.length,
          10
        );

      if (roleScore !== null) {
        categories.push({
          score: roleScore,
          weight: 10,
        });
      }

      const toolsScore =
        calculateCategoryScore(
          toolsMatch.matched.length,
          toolsMatch.required.length,
          10
        );

      if (toolsScore !== null) {
        categories.push({
          score: toolsScore,
          weight: 10,
        });
      }

      const educationScore =
        calculateCategoryScore(
          educationMatch.matched.length,
          educationMatch.required.length,
          5
        );

      if (educationScore !== null) {
        categories.push({
          score: educationScore,
          weight: 5,
        });
      }

      let generalScore = null;

      if (generalJobKeywords.length > 0) {
        generalScore =
          (generalMatched.length /
            generalJobKeywords.length) *
          5;

        categories.push({
          score: generalScore,
          weight: 5,
        });
      }

      // ========================================
      // NORMALIZE SCORE TO 100
      // ========================================

      const achievedScore =
        categories.reduce(
          (total, category) =>
            total + category.score,
          0
        );

      const availableWeight =
        categories.reduce(
          (total, category) =>
            total + category.weight,
          0
        );

      let matchScore = 0;

      if (availableWeight > 0) {
        matchScore = Math.round(
          (achievedScore /
            availableWeight) *
            100
        );
      }

      matchScore = Math.min(
        Math.max(matchScore, 0),
        100
      );

      // ========================================
      // ALL MATCHED / MISSING KEYWORDS
      // ========================================

      const professionalMatch =
        getMatchData(
          jobDescription,
          completeResumeText,
          professionalSkills
        );

      const matchedKeywords =
        uniqueItems([
          ...technicalMatch.matched,
          ...toolsMatch.matched,
          ...professionalMatch.matched,
          ...roleMatch.matched,
        ]);

      const missingKeywords =
        uniqueItems([
          ...technicalMatch.missing,
          ...toolsMatch.missing,
          ...professionalMatch.missing,
          ...roleMatch.missing,
        ]).filter(
          (keyword) =>
            !matchedKeywords.includes(keyword)
        );

      const allRecognizedJobKeywords =
        uniqueItems([
          ...technicalMatch.required,
          ...toolsMatch.required,
          ...professionalMatch.required,
          ...roleMatch.required,
        ]);

      // ========================================
      // MATCH STATUS
      // ========================================

      let matchStatus = "";

      if (availableWeight === 0) {
        matchStatus =
          "Limited Job Match Data";
      } else if (matchScore >= 85) {
        matchStatus =
          "Excellent Job Match";
      } else if (matchScore >= 70) {
        matchStatus =
          "Strong Job Match";
      } else if (matchScore >= 55) {
        matchStatus =
          "Moderate Job Match";
      } else if (matchScore >= 40) {
        matchStatus =
          "Partial Job Match";
      } else {
        matchStatus =
          "Low Job Match";
      }

      // ========================================
      // SUGGESTIONS
      // ========================================

      const suggestions = [];

      if (
        technicalMatch.required.length > 0 &&
        technicalMatch.missing.length > 0
      ) {
        suggestions.push(
          `The job requires technical skills not detected in your resume: ${technicalMatch.missing
            .slice(0, 6)
            .join(
              ", "
            )}. Add them only if you genuinely have these skills.`
        );
      }

      if (
        technicalMatch.required.length > 0 &&
        technicalMatch.matched.length /
          technicalMatch.required.length <
          0.6
      ) {
        suggestions.push(
          "Your technical skill alignment is below 60%. Focus on roles that better match your current skills or strengthen the genuinely missing requirements."
        );
      }

      if (
        responsibilityMatch.required.length >
          0 &&
        responsibilityMatch.matched.length /
          responsibilityMatch.required.length <
          0.5
      ) {
        suggestions.push(
          "Your experience does not strongly reflect the responsibilities described in this job. Highlight relevant responsibilities and outcomes from your real experience."
        );
      }

      if (!experienceText.trim()) {
        suggestions.push(
          "Add relevant work, internship, freelance, or practical experience if available."
        );
      }

      if (!projectsText.trim()) {
        suggestions.push(
          "Add relevant projects that demonstrate practical experience with technologies required by this job."
        );
      } else if (
        jobTechnicalSkills.length > 0 &&
        projectMatchedSkills.length === 0
      ) {
        suggestions.push(
          "Your projects do not clearly demonstrate the technical skills requested in this job. Mention relevant technologies in project descriptions only when you actually used them."
        );
      }

      if (!skillsText.trim()) {
        suggestions.push(
          "Add a dedicated skills section so recruiters and ATS systems can identify your technical strengths more easily."
        );
      }

      if (
        roleMatch.required.length > 0 &&
        roleMatch.matched.length === 0
      ) {
        suggestions.push(
          "The target role is not clearly reflected in your resume summary or experience. Tailor your professional summary to the role when it accurately matches your background."
        );
      }

      if (
        toolsMatch.required.length > 0 &&
        toolsMatch.missing.length > 0
      ) {
        suggestions.push(
          `Review these job-related tools or platforms: ${toolsMatch.missing
            .slice(0, 5)
            .join(
              ", "
            )}. Include only tools you have actually used.`
        );
      }

      if (
        educationMatch.required.length > 0 &&
        educationMatch.matched.length === 0
      ) {
        suggestions.push(
          "The job description mentions an education or qualification requirement that was not clearly detected in your resume."
        );
      }

      if (
        professionalMatch.missing.length > 0
      ) {
        suggestions.push(
          `The job also mentions professional skills such as ${professionalMatch.missing
            .slice(0, 4)
            .join(
              ", "
            )}. Demonstrate these through real experience rather than simply listing them.`
        );
      }

      if (
        matchedKeywords.length > 0
      ) {
        suggestions.push(
          "Keep your strongest matched skills visible in your summary, skills, projects, and experience where they are genuinely relevant."
        );
      }

      if (matchScore >= 85) {
        suggestions.push(
          "Your resume aligns strongly with this job description. Review the final resume for accuracy and make sure every claimed skill is supported by your actual experience."
        );
      }

      if (
        allRecognizedJobKeywords.length ===
          0 &&
        generalJobKeywords.length < 3
      ) {
        suggestions.push(
          "The pasted job description contains limited recognizable job information. Use the complete job posting for a more meaningful analysis."
        );
      }

      // ========================================
      // SAVE RESULT
      // ========================================

      setResult({
        resumeTitle:
          selectedResume.title ||
          "Untitled Resume",

        matchScore,
        matchStatus,

        totalKeywords:
          allRecognizedJobKeywords.length,

        matchedKeywords,
        missingKeywords,

        suggestions:
          uniqueItems(suggestions),
      });
    } catch (error) {
      console.error(
        "Job Match Analysis Error:",
        error
      );

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="job-matcher-page">
      {/* NAVBAR */}

      <nav className="job-matcher-navbar">
        <div
          className="job-matcher-logo"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span>AI</span> Resume
        </div>

        <button
          className="job-matcher-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>
      </nav>

      <main className="job-matcher-container">
        {/* HEADER */}

        <section className="job-matcher-header">
          <p className="job-matcher-small-title">
            JOB MATCH ANALYZER
          </p>

          <h1>
            Match Your Resume With a
            <span> Job Description</span>
          </h1>

          <p>
            Compare your saved resume with a job
            description to analyze relevant skills,
            technologies, responsibilities, projects,
            tools, and important job keywords.
          </p>
        </section>

        {/* ANALYZER CARD */}

        <section className="job-matcher-card">
          <div className="job-matcher-field">
            <label>Select Resume</label>

            <select
              value={selectedResumeId}
              onChange={(e) => {
                setSelectedResumeId(
                  e.target.value
                );
                setResult(null);
              }}
            >
              <option value="">
                Choose a saved resume
              </option>

              {resumes.map((resume) => (
                <option
                  key={
                    resume._id ||
                    resume.id
                  }
                  value={
                    resume._id ||
                    resume.id
                  }
                >
                  {resume.title ||
                    "Untitled Resume"}
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
                {jobDescription.length}{" "}
                characters
              </span>
            </div>

            <textarea
              rows="12"
              value={jobDescription}
              placeholder="Paste the complete job description here..."
              onChange={(e) => {
                setJobDescription(
                  e.target.value
                );
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

            <button
              className="job-clear-btn"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </section>

        {/* NO RESUMES */}

        {resumes.length === 0 && (
          <section className="job-matcher-empty">
            <h2>No Saved Resumes</h2>

            <p>
              Create and save a resume before
              using the job match analyzer.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/create-resume"
                )
              }
            >
              Create Resume
            </button>
          </section>
        )}

        {/* RESULTS */}

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
                <p>Resume Match</p>

                <h2>
                  {result.matchStatus}
                </h2>

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
                  {
                    result
                      .matchedKeywords
                      .length
                  }
                </strong>

                <span>Matched</span>
              </div>

              <div className="job-match-stat">
                <strong>
                  {
                    result
                      .missingKeywords
                      .length
                  }
                </strong>

                <span>Missing</span>
              </div>
            </div>

            {/* MATCHED */}

            <div className="job-match-result-card">
              <h2>
                ✓ Matched Skills & Keywords
              </h2>

              {result.matchedKeywords
                .length > 0 ? (
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
                  No recognized job skills
                  or keywords were found in
                  the selected resume.
                </p>
              )}
            </div>

            {/* MISSING */}

            <div className="job-match-result-card">
              <h2>
                ⚠ Missing Skills & Keywords
              </h2>

              {result.missingKeywords
                .length > 0 ? (
                <>
                  <p className="job-match-warning">
                    These skills or keywords
                    appear in the job
                    description but were not
                    detected in your resume.
                    Add them only if they
                    accurately represent your
                    real skills or experience.
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
                <p>
                  No missing recognized
                  skills or keywords
                  detected.
                </p>
              )}
            </div>

            {/* SUGGESTIONS */}

            <div className="job-match-result-card">
              <h2>
                💡 Improvement Suggestions
              </h2>

              {result.suggestions.length >
              0 ? (
                <ul>
                  {result.suggestions.map(
                    (
                      suggestion,
                      index
                    ) => (
                      <li key={index}>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  No additional suggestions
                  available.
                </p>
              )}
            </div>

            {/* NOTE */}

            <div className="job-match-note">
              <strong>Note:</strong>{" "}
              This match percentage is an
              application-generated compatibility
              score based on the selected resume
              and pasted job description. It is
              not a hiring probability or an
              employer's proprietary ATS score.
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default JobMatcher;