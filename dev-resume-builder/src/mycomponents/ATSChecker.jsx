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

  // ==========================================
  // FETCH USER RESUMES
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

  // ==========================================
  // HELPERS
  // ==========================================

  const hasContent = (value) => {
    if (!value) return false;

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.some((item) => hasContent(item));
    }

    if (typeof value === "object") {
      return Object.values(value).some((item) =>
        hasContent(item)
      );
    }

    return false;
  };

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

  const cleanText = (value) =>
    getAllText(value)
      .replace(/\s+/g, " ")
      .trim();

  const getWordCount = (value) => {
    const text = cleanText(value);

    if (!text) return 0;

    return text
      .split(/\s+/)
      .filter(Boolean).length;
  };

  const getSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      return skills
        .flatMap((skill) => {
          if (typeof skill === "string") {
            return skill.split(/[,;\n|]/);
          }

          return [cleanText(skill)];
        })
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    if (typeof skills === "string") {
      return skills
        .split(/[,;\n|]/)
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return cleanText(skills)
      .split(/[,;\n|]/)
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const countMatches = (text, words) => {
    const lowerText = text.toLowerCase();

    return words.filter((word) => {
      const regex = new RegExp(
        `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );

      return regex.test(lowerText);
    }).length;
  };

  // ==========================================
  // ATS CHECK
  // ==========================================

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

      const summary =
        data.summary ||
        resume.aiSummary ||
        "";

      const skills = data.skills || "";
      const experience = data.experience || "";
      const projects = data.projects || "";
      const certifications = data.certifications || "";
      const achievements = data.achievements || "";

      const strengths = [];
      const issues = [];
      const suggestions = [];

      let score = 0;

      // ==========================================
      // 1. CONTACT INFORMATION — 5
      // ==========================================

      let contactScore = 0;

      const name =
        personal.name ||
        personal.fullName ||
        "";

      const email = personal.email || "";
      const phone = personal.phone || "";

      const emailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          String(email).trim()
        );

      const phoneDigits = String(phone).replace(
        /\D/g,
        ""
      );

      if (hasContent(name)) {
        contactScore += 1;
      } else {
        issues.push("Your full name is missing.");
      }

      if (emailValid) {
        contactScore += 2;
      } else {
        issues.push(
          "Add a valid professional email address."
        );
      }

      if (
        hasContent(phone) &&
        phoneDigits.length >= 8
      ) {
        contactScore += 1;
      } else {
        issues.push(
          "Add a valid phone number."
        );
      }

      if (
        hasContent(personal.location) ||
        hasContent(personal.linkedin) ||
        hasContent(personal.github)
      ) {
        contactScore += 1;
      } else {
        suggestions.push(
          "Add location and a relevant professional link such as LinkedIn or GitHub."
        );
      }

      score += contactScore;

      if (contactScore >= 4) {
        strengths.push(
          "Contact information is ATS-friendly and sufficiently complete."
        );
      }

      // ==========================================
      // 2. PROFESSIONAL SUMMARY QUALITY — 10
      // ==========================================

      const summaryWords = getWordCount(summary);

      let summaryScore = 0;

      if (!hasContent(summary)) {
        issues.push(
          "Professional summary is missing."
        );

        suggestions.push(
          "Add a concise professional summary highlighting your role, strongest skills, and career value."
        );
      } else {
        // Having a summary alone is not enough.
        summaryScore += 2;

        if (
          summaryWords >= 25 &&
          summaryWords <= 100
        ) {
          summaryScore += 4;
        } else if (
          summaryWords >= 15 &&
          summaryWords < 25
        ) {
          summaryScore += 2;

          suggestions.push(
            "Expand your professional summary with more role-specific skills and value."
          );
        } else if (summaryWords > 100) {
          summaryScore += 2;

          suggestions.push(
            "Shorten your professional summary to keep it focused and ATS-friendly."
          );
        } else {
          issues.push(
            "Professional summary is too short to communicate your value effectively."
          );
        }

        const summaryKeywords = [
          "developer",
          "engineer",
          "designer",
          "analyst",
          "manager",
          "specialist",
          "professional",
          "experience",
          "skilled",
          "proficient",
          "expertise",
          "frontend",
          "backend",
          "full stack",
          "software",
          "data",
          "web",
          "application",
        ];

        const summaryKeywordCount =
          countMatches(
            cleanText(summary),
            summaryKeywords
          );

        if (summaryKeywordCount >= 2) {
          summaryScore += 2;
        } else {
          suggestions.push(
            "Include your target role and relevant professional keywords in the summary."
          );
        }

        if (getSkills(skills).length > 0) {
          const summaryLower =
            cleanText(summary).toLowerCase();

          const skillMentioned =
            getSkills(skills).some(
              (skill) =>
                skill.length > 2 &&
                summaryLower.includes(
                  skill.toLowerCase()
                )
            );

          if (skillMentioned) {
            summaryScore += 2;
          }
        }

        if (summaryScore >= 8) {
          strengths.push(
            "Professional summary provides strong ATS-relevant information."
          );
        }
      }

      score += Math.min(summaryScore, 10);

      // ==========================================
      // 3. SKILLS QUALITY — 10
      // ==========================================

      const skillList = [
        ...new Set(
          getSkills(skills).map((skill) =>
            skill.toLowerCase()
          )
        ),
      ];

      let skillsScore = 0;

      if (skillList.length === 0) {
        issues.push("Skills section is missing.");

        suggestions.push(
          "Add role-relevant technical and professional skills."
        );
      } else {
        if (skillList.length >= 8) {
          skillsScore += 7;
        } else if (skillList.length >= 5) {
          skillsScore += 5;
        } else if (skillList.length >= 3) {
          skillsScore += 3;
        } else {
          skillsScore += 1;

          issues.push(
            "Your skills section contains too few skills."
          );
        }

        const meaningfulSkills =
          skillList.filter(
            (skill) =>
              skill.length >= 2 &&
              skill.length <= 40
          );

        if (
          meaningfulSkills.length ===
          skillList.length
        ) {
          skillsScore += 1;
        }

        const genericSkills = [
          "hardworking",
          "punctual",
          "honest",
          "good",
          "smart",
          "friendly",
        ];

        const genericCount =
          skillList.filter((skill) =>
            genericSkills.includes(skill)
          ).length;

        if (genericCount === 0) {
          skillsScore += 2;
        } else {
          suggestions.push(
            "Prioritize job-relevant technical skills over generic personality traits."
          );
        }

        if (
          skillList.length >= 8 &&
          genericCount === 0
        ) {
          strengths.push(
            "Skills section has a strong range of ATS-readable keywords."
          );
        }
      }

      score += Math.min(skillsScore, 10);

      // ==========================================
      // 4. EDUCATION COMPLETENESS — 8
      // ==========================================

      let educationScore = 0;

      const educationText =
        cleanText(education);

      const educationWords =
        getWordCount(education);

      if (!hasContent(education)) {
        issues.push(
          "Education information is missing."
        );

        suggestions.push(
          "Add degree, institution, and graduation details."
        );
      } else {
        educationScore += 2;

        const educationDegreeTerms = [
          "bachelor",
          "master",
          "b.tech",
          "btech",
          "m.tech",
          "mtech",
          "b.e",
          "m.e",
          "b.sc",
          "m.sc",
          "degree",
          "diploma",
          "computer science",
          "engineering",
        ];

        if (
          countMatches(
            educationText,
            educationDegreeTerms
          ) > 0
        ) {
          educationScore += 2;
        }

        const hasEducationYear =
          /\b(19|20)\d{2}\b/.test(
            educationText
          );

        if (hasEducationYear) {
          educationScore += 2;
        } else {
          suggestions.push(
            "Include graduation year or education dates."
          );
        }

        if (educationWords >= 5) {
          educationScore += 2;
        } else {
          suggestions.push(
            "Provide complete education details including institution and qualification."
          );
        }

        if (educationScore >= 6) {
          strengths.push(
            "Education section contains useful qualification details."
          );
        }
      }

      score += Math.min(educationScore, 8);

      // ==========================================
      // 5. EXPERIENCE COMPLETENESS — 15
      // ==========================================

      const experienceText =
        cleanText(experience);

      const experienceWords =
        getWordCount(experience);

      let experienceScore = 0;

      if (!hasContent(experience)) {
        issues.push(
          "Work or internship experience is missing."
        );

        suggestions.push(
          "Add internships, freelance work, practical training, or relevant work experience when available."
        );
      } else {
        experienceScore += 3;

        if (experienceWords >= 80) {
          experienceScore += 7;
        } else if (experienceWords >= 50) {
          experienceScore += 5;
        } else if (experienceWords >= 25) {
          experienceScore += 3;
        } else {
          experienceScore += 1;

          issues.push(
            "Experience descriptions are too brief."
          );
        }

        if (
          /\b(19|20)\d{2}\b/.test(
            experienceText
          ) ||
          /\b(present|current)\b/i.test(
            experienceText
          )
        ) {
          experienceScore += 2;
        } else {
          suggestions.push(
            "Include employment or internship dates where applicable."
          );
        }

        if (
          experienceText.length >= 120
        ) {
          experienceScore += 3;
        }

        if (experienceScore >= 11) {
          strengths.push(
            "Experience section provides substantial ATS-readable content."
          );
        }
      }

      score += Math.min(
        experienceScore,
        15
      );

      // ==========================================
      // 6. EXPERIENCE QUALITY — 10
      // ==========================================

      let experienceQualityScore = 0;

      const actionVerbs = [
        "achieved",
        "analyzed",
        "automated",
        "built",
        "collaborated",
        "created",
        "designed",
        "developed",
        "engineered",
        "implemented",
        "improved",
        "increased",
        "integrated",
        "launched",
        "led",
        "managed",
        "optimized",
        "reduced",
        "resolved",
        "tested",
        "maintained",
        "delivered",
        "deployed",
        "enhanced",
        "generated",
        "coordinated",
      ];

      const experienceActionCount =
        countMatches(
          experienceText,
          actionVerbs
        );

      if (hasContent(experience)) {
        if (experienceActionCount >= 4) {
          experienceQualityScore += 5;
        } else if (
          experienceActionCount >= 2
        ) {
          experienceQualityScore += 3;
        } else if (
          experienceActionCount === 1
        ) {
          experienceQualityScore += 1;
        }

        const experienceHasImpact =
          /(\d+%|\d+\+|\$\s?\d+|\b\d+\s*(users|clients|customers|projects|applications|features|hours|days|weeks|months)\b)/i.test(
            experienceText
          );

        if (experienceHasImpact) {
          experienceQualityScore += 3;
        }

        if (experienceWords >= 50) {
          experienceQualityScore += 2;
        }

        if (
          experienceQualityScore >= 7
        ) {
          strengths.push(
            "Experience descriptions use strong, results-oriented language."
          );
        } else {
          suggestions.push(
            "Write experience points using action verbs, responsibilities, technologies, and outcomes."
          );
        }
      }

      score += Math.min(
        experienceQualityScore,
        10
      );

      // ==========================================
      // 7. PROJECT QUALITY — 10
      // ==========================================

      const projectText =
        cleanText(projects);

      const projectWords =
        getWordCount(projects);

      let projectScore = 0;

      if (!hasContent(projects)) {
        issues.push(
          "Projects section is missing."
        );

        suggestions.push(
          "Add relevant projects that demonstrate practical skills, technologies, and outcomes."
        );
      } else {
        projectScore += 2;

        if (projectWords >= 60) {
          projectScore += 4;
        } else if (projectWords >= 30) {
          projectScore += 3;
        } else if (projectWords >= 15) {
          projectScore += 1;
        } else {
          issues.push(
            "Project descriptions are too short."
          );
        }

        const projectActionCount =
          countMatches(
            projectText,
            actionVerbs
          );

        if (projectActionCount >= 2) {
          projectScore += 2;
        } else if (
          projectActionCount === 1
        ) {
          projectScore += 1;
        }

        const projectSkillMatches =
          skillList.filter(
            (skill) =>
              skill.length > 2 &&
              projectText
                .toLowerCase()
                .includes(skill)
          ).length;

        if (projectSkillMatches >= 2) {
          projectScore += 2;
        } else if (
          projectSkillMatches === 1
        ) {
          projectScore += 1;
        } else {
          suggestions.push(
            "Mention the technologies or tools used in your projects."
          );
        }

        if (projectScore >= 7) {
          strengths.push(
            "Projects demonstrate relevant practical skills."
          );
        }
      }

      score += Math.min(projectScore, 10);

      // ==========================================
      // 8. MEASURABLE IMPACT — 10
      // ==========================================

      const achievementText =
        cleanText({
          experience,
          projects,
          achievements,
        });

      const measurablePatterns = [
        /\b\d+%/g,
        /\b\d+\+/g,
        /\$\s?\d+/g,
        /\b\d+\s*(users|clients|customers|projects|features|applications|tasks|hours|days|weeks|months)\b/gi,
        /\b(increased|improved|reduced|saved|grew|boosted|optimized)\b[^.!?\n]{0,60}\d+/gi,
      ];

      let measurableCount = 0;

      measurablePatterns.forEach(
        (pattern) => {
          const matches =
            achievementText.match(pattern);

          if (matches) {
            measurableCount +=
              matches.length;
          }
        }
      );

      let impactScore = 0;

      if (measurableCount >= 4) {
        impactScore = 10;

        strengths.push(
          "Resume demonstrates measurable impact with quantified results."
        );
      } else if (measurableCount >= 2) {
        impactScore = 7;

        strengths.push(
          "Resume includes some measurable achievements."
        );
      } else if (measurableCount === 1) {
        impactScore = 4;

        suggestions.push(
          "Add more measurable outcomes such as percentages, user counts, time saved, or performance improvements."
        );
      } else {
        issues.push(
          "Resume lacks measurable achievements or quantified impact."
        );

        suggestions.push(
          "Quantify achievements where possible, for example: Improved performance by 30% or Built a system used by 500+ users."
        );
      }

      score += impactScore;

      // ==========================================
      // 9. ACTION VERBS — 7
      // ==========================================

      const relevantContent =
        cleanText({
          experience,
          projects,
          achievements,
        });

      const actionVerbCount =
        countMatches(
          relevantContent,
          actionVerbs
        );

      let actionScore = 0;

      if (actionVerbCount >= 6) {
        actionScore = 7;

        strengths.push(
          "Resume consistently uses strong action verbs."
        );
      } else if (actionVerbCount >= 4) {
        actionScore = 5;
      } else if (actionVerbCount >= 2) {
        actionScore = 3;
      } else if (actionVerbCount === 1) {
        actionScore = 1;

        suggestions.push(
          "Use more strong action verbs throughout your experience and projects."
        );
      } else {
        issues.push(
          "Very little action-oriented language was detected."
        );

        suggestions.push(
          "Start accomplishment statements with verbs such as Developed, Built, Implemented, Improved, Led, or Optimized."
        );
      }

      score += actionScore;

      // ==========================================
      // 10. CERTIFICATIONS / ACHIEVEMENTS — 5
      // ==========================================

      let extraScore = 0;

      if (hasContent(certifications)) {
        extraScore += 3;
      }

      if (hasContent(achievements)) {
        extraScore += 2;
      }

      if (extraScore >= 3) {
        strengths.push(
          "Resume includes additional credentials or achievements."
        );
      } else if (extraScore === 0) {
        suggestions.push(
          "Add relevant certifications or achievements if you have them."
        );
      }

      score += extraScore;

      // ==========================================
      // 11. ATS-FRIENDLY STRUCTURE — 5
      // ==========================================

      let structureScore = 0;

      if (hasContent(summary)) {
        structureScore += 1;
      }

      if (skillList.length > 0) {
        structureScore += 1;
      }

      if (hasContent(education)) {
        structureScore += 1;
      }

      if (
        hasContent(experience) ||
        hasContent(projects)
      ) {
        structureScore += 1;
      }

      if (
        hasContent(name) &&
        emailValid
      ) {
        structureScore += 1;
      }

      if (structureScore === 5) {
        strengths.push(
          "Resume contains the main ATS-readable sections."
        );
      }

      score += structureScore;

      // ==========================================
      // 12. OVERALL CONTENT QUALITY — 5
      // ==========================================

      const coreResumeText =
        cleanText({
          summary,
          skills,
          education,
          experience,
          projects,
          certifications,
          achievements,
        });

      const totalWords =
        getWordCount(coreResumeText);

      let contentScore = 0;

      if (totalWords >= 250) {
        contentScore = 5;
      } else if (totalWords >= 180) {
        contentScore = 4;
      } else if (totalWords >= 120) {
        contentScore = 3;
      } else if (totalWords >= 70) {
        contentScore = 2;
      } else if (totalWords >= 30) {
        contentScore = 1;
      }

      if (totalWords < 120) {
        issues.push(
          "Overall resume content is too limited for a strong ATS profile."
        );

        suggestions.push(
          "Add meaningful details to your summary, experience, education, and projects instead of relying on short section entries."
        );
      } else if (totalWords >= 180) {
        strengths.push(
          "Resume contains a useful amount of ATS-readable content."
        );
      }

      score += contentScore;

      // ==========================================
      // FINAL SCORE
      // ==========================================

      score = Math.round(
        Math.min(Math.max(score, 0), 100)
      );

      let status = "";

      if (score >= 90) {
        status = "Excellent ATS Resume";
      } else if (score >= 80) {
        status = "Strong ATS Resume";
      } else if (score >= 70) {
        status = "Good - Needs Optimization";
      } else if (score >= 55) {
        status = "Needs Improvement";
      } else {
        status = "ATS Optimization Required";
      }

      setResult({
        score,
        status,
        strengths: [
          ...new Set(strengths),
        ],
        issues: [
          ...new Set(issues),
        ],
        suggestions: [
          ...new Set(suggestions),
        ],
        resumeTitle:
          resume.title || "Untitled Resume",
      });
    } catch (error) {
      console.error(
        "ATS Check Error:",
        error
      );

      alert("Unable to analyze resume");
    } finally {
      setChecking(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="ats-page">
        <p className="ats-loading">
          Loading resumes...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="ats-page">
      {/* NAVBAR */}

      <nav className="ats-navbar">
        <div
          className="ats-logo"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span>AI</span> Resume
        </div>

        <button
          className="ats-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>
      </nav>

      <main className="ats-container">
        {/* HEADER */}

        <section className="ats-header">
          <p className="ats-small-title">
            ATS RESUME CHECKER
          </p>

          <h1>
            Check Your Resume
            <span> ATS Score</span>
          </h1>

          <p>
            Analyze your saved resume for
            ATS-friendly structure, content
            quality, measurable impact, skills,
            and professional resume best
            practices.
          </p>
        </section>

        {/* SELECT RESUME */}

        <section className="ats-check-card">
          <h2>Select Resume</h2>

          {resumes.length === 0 ? (
            <div className="ats-empty">
              <p>
                You don't have any saved
                resumes yet.
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
            </div>
          ) : (
            <>
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
                  Choose a resume
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

              <button
                className="check-ats-btn"
                onClick={handleCheckATS}
                disabled={checking}
              >
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

                <h2>
                  {result.status}
                </h2>

                <span>
                  {result.resumeTitle}
                </span>
              </div>
            </div>

            {/* STRENGTHS */}

            <div className="ats-result-card">
              <h2>✓ Strengths</h2>

              {result.strengths.length >
              0 ? (
                <ul>
                  {result.strengths.map(
                    (item, index) => (
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
                  {result.issues.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  No major ATS issues detected.
                </p>
              )}
            </div>

            {/* SUGGESTIONS */}

            <div className="ats-result-card">
              <h2>💡 Suggestions</h2>

              {result.suggestions.length >
              0 ? (
                <ul>
                  {result.suggestions.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Your resume is well
                  optimized for the checks
                  performed.
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