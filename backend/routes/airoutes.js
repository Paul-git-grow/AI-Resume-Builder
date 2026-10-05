const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", authMiddleware, async (req, res) => {
  console.log(
  "AI REQUEST RECEIVED:",
  new Date().toISOString(),
  "TYPE:",
  req.body.type
);
  try {
    const { type, content } = req.body;

    if (!type) {
      return res.status(400).json({
        message: "AI generation type is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured",
      });
    }

    // @google/genai is an ES module,
    // so dynamic import is used inside this CommonJS backend.
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let instruction = "";

    switch (type) {
      case "summary":
  instruction = `
Create a concise, professional, ATS-friendly resume summary.

Rules:
- Use ONLY facts explicitly provided by the user.
- Rewrite the information into polished professional resume language.
- Highlight relevant skills, technical knowledge, projects,
  experience, education, or strengths only when supported by the input.
- Use clear ATS-friendly terminology.
- Keep the summary approximately 3 to 4 sentences.
- Do NOT use bullet points.
- Do NOT add a "Professional Summary" heading.
- Do NOT use first-person pronouns such as "I", "me", or "my".
- Avoid unnecessary filler statements.
- Do NOT invent companies, experience, education, technologies,
  certifications, achievements, numbers, percentages, or metrics.
- Do NOT exaggerate the user's experience.
- Return ONLY the improved summary.
`;
  break;

     case "project":
  instruction = `
Improve the user's project information into strong,
professional, ATS-friendly resume project descriptions.

STRICT OUTPUT FORMAT:
- Provide a moderately detailed ATS-friendly description for each project.
- Each project description should normally contain 2 to 3 meaningful sentences when enough information is provided.
- Explain the project's purpose, the user's contribution, technologies used, and important functionality when those details are present in the user's input.
- Expand short user input into polished professional resume language without adding new facts.
- Do not make the description unnecessarily short when sufficient project information is available.
- Avoid vague one-line descriptions when the user has provided enough details.
- Remove only unnecessary or repetitive wording.
- Every project MUST start with the exact bullet character "•".
- Use this exact format:
  • Project Name: Professional ATS-friendly project description.
- Do NOT use "-", "*", numbering, or any other bullet style.
- Do NOT combine multiple projects into one paragraph.
- Do NOT add a "Projects" heading.

ATS WRITING RULES:
- Use ONLY project information explicitly provided by the user.
- Preserve the original project name exactly when provided.
- Rewrite simple or informal descriptions into professional
  resume-style descriptions.
- Clearly explain what was developed, built, designed,
  implemented, created, or integrated when supported by the input.
- Naturally include programming languages, technologies,
  frameworks, databases, tools, features, and functionality
  ONLY when provided by the user.
- Begin descriptions with strong action verbs when appropriate,
  such as Developed, Built, Designed, Implemented, Created,
  Integrated, or Engineered.
- Improve grammar, clarity, readability, and ATS keyword relevance.
- Keep every project description concise and impactful.
- Remove unnecessary and repetitive wording.


DETAIL RULE:
- Expand the description using ONLY the facts provided by the user.
- You may reorganize and professionally elaborate on provided information,
  but you MUST NOT create new technologies, features, responsibilities,
  metrics, results, or achievements.
- If the user provides very little information, keep the description
  shorter rather than inventing details.


STRICT FACTUAL RULES:
- Do NOT invent technologies, tools, frameworks, databases,
  features, responsibilities, companies, users, achievements,
  numbers, percentages, metrics, or results.
- Do NOT claim performance improvements or measurable results
  unless explicitly provided by the user.
- Do NOT exaggerate the project.
- Preserve all factual information provided by the user.
- Return ONLY the improved project content.

Required output style:
• AI Resume Builder: Developed a resume-building application using the technologies and features provided by the user.
• Portfolio Website: Created a responsive portfolio website based on the provided project information.
`;
  break;

     case "skills":
  instruction = `
Review and improve the user's skills for a professional,
ATS-friendly resume.

ATS RULES:
- Use ONLY skills explicitly provided by the user or clearly
  supported by the user's provided projects, experience,
  education, and resume information.
- Prioritize relevant technical and professional skills.
- Preserve valid programming languages, frameworks, libraries,
  databases, tools, platforms, and professional skills.
- Use standard ATS-friendly skill names where appropriate.
- Remove duplicate skills.
- Keep the skills concise and relevant.

STRICT OUTPUT FORMAT:
- Return ONLY the skill names.
- Separate EVERY skill using a comma.
- Do NOT use bullet points.
- Do NOT use "-", "*", "•", or numbering.
- Do NOT add descriptions or explanations.
- Do NOT add a "Skills" or "Suggested Skills" heading.
- Do NOT return sentences or paragraphs.

STRICT FACTUAL RULES:
- Do NOT invent unsupported skills or technologies.
- Do NOT add a technology simply because it is commonly
  associated with another technology.
- Do NOT claim proficiency levels such as Expert, Advanced,
  or Intermediate unless explicitly provided by the user.
- Preserve the user's factual information.

Required output style:
JavaScript, React.js, Node.js, Express.js, MongoDB, Git, REST API
`;
  break;

 case "experience":
  instruction = `
Improve the user's work experience or internship information
into strong, professional, ATS-friendly resume content.

STRICT OUTPUT FORMAT:
- Provide moderately detailed, ATS-friendly experience content.
- When enough information is provided, generate approximately 2 to 4
  meaningful bullet points for each job or internship.
- Each bullet should clearly describe a responsibility, contribution,
  task, technology, tool, or work performed when supported by the input.
- Expand short or informal user input into polished professional
  resume language without changing its factual meaning.
- Give enough context to explain what the user actually worked on.
- Avoid overly short or vague bullet points when the user has provided
  enough information.
- Keep each bullet approximately 1 to 2 sentences when appropriate.
- Remove only unnecessary or repetitive wording.
- EVERY responsibility or work detail MUST start with
  the exact bullet character "•".
- EVERY bullet MUST be written on a separate new line.
- Do NOT use "-", "*", numbering, or any other bullet style.
- Do NOT combine multiple responsibilities into one paragraph.
- Do NOT add an "Experience" heading.

ATS WRITING RULES:
- Use ONLY experience information explicitly provided by the user.
- Rewrite simple or informal sentences into professional
  resume-style bullet points.
- Begin each bullet with a strong action verb when appropriate,
  such as Developed, Implemented, Designed, Built, Created,
  Assisted, Managed, Collaborated, Analyzed, Supported,
  Maintained, Tested, or Integrated.
- Clearly communicate responsibilities, contributions,
  technologies, tools, and work performed when those details
  are present in the user's input.
- Improve grammar, clarity, readability, and ATS relevance.
- Keep every bullet concise, meaningful, and professional.
- Remove unnecessary or repetitive wording.
- Preserve company names, job roles, internship names,
  technologies, and dates exactly when provided.

  DETAIL RULE:
- Expand and professionally elaborate ONLY on information already
  provided by the user.
- You may reorganize the provided information into multiple strong
  ATS-friendly bullet points when appropriate.
- Do NOT create additional responsibilities just to reach 2 to 4 bullets.
- Do NOT invent technologies, tools, projects, responsibilities,
  achievements, metrics, results, or business impact.
- If the user provides very little information, generate fewer bullets
  rather than inventing details.

STRICT FACTUAL RULES:
- Do NOT invent companies, job roles, technologies,
  responsibilities, dates, achievements, numbers,
  percentages, metrics, or results.
- Do NOT exaggerate the user's responsibilities.
- Do NOT add unsupported work experience.
- Do NOT claim measurable improvements or business impact
  unless explicitly provided by the user.
- Preserve the user's original facts and meaning.
- Return ONLY the improved experience content.

Required output style:
• Developed responsive frontend pages using React.js.
• Integrated REST APIs with frontend components.
• Collaborated on application development and testing.
`;
  break;

case "certifications":
  instruction = `
Improve the user's certifications into clean, professional,
ATS-friendly resume content.

STRICT OUTPUT FORMAT:
- Keep EVERY certification separate.
- EVERY certification MUST be written on a separate new line.
- EVERY certification MUST start with the exact bullet character "•".
- Do NOT use "-", "*", numbering, or any other bullet style.
- Do NOT combine multiple certifications into one paragraph.
- Do NOT add a "Certifications" heading.

ATS WRITING RULES:
- Use ONLY certifications explicitly provided by the user.
- Preserve certification names exactly when provided.
- Preserve organization or issuing authority names when provided.
- Preserve dates, scores, levels, or credentials ONLY when provided.
- Improve grammar and presentation where necessary.
- Keep each certification concise, professional, and easy for
  ATS systems to parse.
- Remove unnecessary or repetitive wording.
- Do NOT add unnecessary explanations or descriptions.

STRICT FACTUAL RULES:
- Do NOT invent certification names, organizations,
  issuing authorities, dates, scores, credentials,
  technologies, or completion details.
- Do NOT claim the user is certified in something that
  was not explicitly provided.
- Do NOT exaggerate certification details.
- Preserve the user's original facts and meaning.
- Return ONLY the improved certification content.

Required output style:
• Python Programming — XYZ Academy
• Full Stack Development — ABC Institute
`;
  break;

case "achievements":
  instruction = `
Improve the user's achievements into strong, professional,
ATS-friendly resume content.

STRICT OUTPUT FORMAT:
- Keep EVERY achievement separate.
- EVERY achievement MUST be written on a separate new line.
- EVERY achievement MUST start with the exact bullet character "•".
- Do NOT use "-", "*", numbering, or any other bullet style.
- Do NOT combine multiple achievements into one paragraph.
- Do NOT add an "Achievements" heading.

ATS WRITING RULES:
- Use ONLY achievements explicitly provided by the user.
- Rewrite simple or informal descriptions into concise,
  professional resume-style achievements.
- Begin with a strong action verb when appropriate, such as
  Achieved, Secured, Earned, Completed, Participated,
  Presented, Won, Recognized, or Demonstrated.
- Clearly highlight awards, recognition, competitions,
  hackathons, events, courses, accomplishments, or
  participation when those facts are provided.
- Improve grammar, clarity, readability, and ATS relevance.
- Keep every achievement concise and impactful.
- Remove unnecessary or repetitive wording.
- Preserve event names, competition names, institution names,
  course names, awards, ranks, and other facts when provided.

STRICT FACTUAL RULES:
- Do NOT invent awards, ranks, positions, scores,
  percentages, dates, organizations, results,
  achievements, or participation.
- Do NOT exaggerate the user's achievement.
- Do NOT add measurable results unless explicitly provided.
- Preserve the user's original facts and meaning.
- Return ONLY the improved achievement content.

Required output style:
• Participated in a college-level hackathon and developed a web application.
• Presented a technical project at a college event.
`;
  break;


  case "resume":
  instruction = `
Improve the user's complete resume into professional,
clear, consistent, ATS-friendly resume content.

IMPORTANT OUTPUT RULE:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use code blocks.
- Do NOT add explanations before or after the JSON.

Use EXACTLY this JSON structure:

{
  "summary": "",
  "skills": "",
  "projects": "",
  "experience": "",
  "certifications": "",
  "achievements": ""
}

GLOBAL ATS RULES:
- Use ONLY facts explicitly provided by the user.
- Improve grammar, clarity, professional wording,
  action verbs, readability, and ATS relevance.
- Preserve the user's original meaning and factual information.
- Use clear and commonly understood professional terminology.
- Keep the content concise and easy to scan.
- Remove unnecessary filler words and repetitive statements.
- Do NOT invent any new information.
- Do NOT invent companies, job roles, dates, education,
  technologies, tools, projects, certifications,
  achievements, awards, responsibilities, numbers,
  percentages, metrics, results, or experience.
- Do NOT exaggerate the user's experience or achievements.
- Do NOT add measurable impact unless explicitly provided.
- If a section has no information, return an empty string.

SUMMARY:
- Write a concise ATS-friendly professional summary.
- Keep it approximately 3 to 4 sentences.
- Do NOT use bullet points.
- Do NOT use first-person pronouns such as "I", "me", or "my".
- Highlight relevant skills, projects, experience, education,
  or strengths ONLY when supported by the user's information.
- Do NOT add a "Professional Summary" heading.

SKILLS:
- Return ONLY skill names.
- Separate EVERY skill using commas.
- Remove obvious duplicate skills.
- Use only skills provided by or clearly supported by
  the user's resume information.
- Do NOT use bullet points.
- Do NOT add descriptions or explanations.
- Do NOT add a "Skills" heading.

PROJECTS:
- Keep EVERY project separate.
- EVERY project MUST start with the exact bullet character "•".
- EVERY project MUST be written on a separate new line.
- Use this format:
  • Project Name: Professional ATS-friendly description.
- Preserve project names when provided.
- Include technologies, tools, features, and functionality
  ONLY when supported by the user's information.
- Use strong action-oriented professional wording.
- Do NOT use "-", "*", or numbering.
- Do NOT combine multiple projects into one paragraph.
- Do NOT add a "Projects" heading.

EXPERIENCE:
- Keep different jobs or internships separate.
- EVERY responsibility or work detail MUST start with
  the exact bullet character "•".
- EVERY responsibility MUST be written on a separate new line.
- Begin with strong action verbs when appropriate.
- Clearly communicate responsibilities, contributions,
  technologies, tools, and work performed using ONLY
  the user's provided information.
- Preserve company names, roles, technologies, and dates
  when provided.
- Do NOT use "-", "*", or numbering.
- Do NOT combine multiple responsibilities into one paragraph.
- Do NOT add an "Experience" heading.

CERTIFICATIONS:
- Keep EVERY certification separate.
- EVERY certification MUST start with the exact bullet character "•".
- EVERY certification MUST be written on a separate new line.
- Preserve certification names, organizations, dates,
  scores, and credentials ONLY when provided.
- Keep every certification concise and ATS-friendly.
- Do NOT add unnecessary explanations.
- Do NOT use "-", "*", or numbering.
- Do NOT add a "Certifications" heading.

ACHIEVEMENTS:
- Keep EVERY achievement separate.
- EVERY achievement MUST start with the exact bullet character "•".
- EVERY achievement MUST be written on a separate new line.
- Use concise, professional, ATS-friendly wording.
- Begin with strong action verbs when appropriate.
- Preserve awards, events, ranks, organizations,
  competitions, and other provided facts.
- Do NOT invent or exaggerate achievements.
- Do NOT add measurable results unless explicitly provided.
- Do NOT use "-", "*", or numbering.
- Do NOT add an "Achievements" heading.

FINAL VALIDATION:
Before returning the response, verify that:
1. The response is valid JSON.
2. All six keys are present.
3. Summary contains no bullets.
4. Skills are comma-separated and contain no bullets.
5. Every project starts with "•".
6. Every experience point starts with "•".
7. Every certification starts with "•".
8. Every achievement starts with "•".
9. Every bullet item is on a separate new line.
10. No unsupported or invented facts were added.

Return ONLY the final valid JSON.
`;
  break;

      default:
        return res.status(400).json({
          message: "Invalid AI generation type",
        });
    }

    const userContent =
      typeof content === "string"
        ? content
        : JSON.stringify(content || {}, null, 2);

    const prompt = `
${instruction}

USER PROVIDED RESUME INFORMATION:
${userContent || "No additional resume information was provided."}
`;

 let response;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
  response = await ai.models.generateContent({
  model:"gemma-4-26b-a4b-it",
  contents: prompt,
});
  

    break;
  } catch (error) {
    console.log(
      `Gemini attempt ${attempt} failed:`,
      error.status
    );

    // Gemini server temporarily busy
   if (
  (error.status === 500 || error.status === 503) &&
  attempt < 3
) {
      const waitTime = attempt * 5000;

      console.log(
        `Gemini server busy. Retrying in ${
          waitTime / 1000
        } seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, waitTime)
      );

      continue;
    }

    // Quota exceeded - retrying immediately will not help
    if (error.status === 429) {
      throw error;
    }

    throw error;
  }
}

    const generatedText = response.text?.trim();

if (!generatedText) {
  return res.status(500).json({
    message: "AI did not generate any content",
  });
}

// Whole resume improvement returns structured JSON
if (type === "resume") {
  try {
    // Remove markdown code blocks if the AI adds them accidentally
    const cleanedText = generatedText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const improvedResume = JSON.parse(cleanedText);

    const safeResume = {
      summary:
        typeof improvedResume.summary === "string"
          ? improvedResume.summary
          : "",

      skills:
        typeof improvedResume.skills === "string"
          ? improvedResume.skills
          : "",

      projects:
        typeof improvedResume.projects === "string"
          ? improvedResume.projects
          : "",

      experience:
        typeof improvedResume.experience === "string"
          ? improvedResume.experience
          : "",

      certifications:
        typeof improvedResume.certifications === "string"
          ? improvedResume.certifications
          : "",

      achievements:
        typeof improvedResume.achievements === "string"
          ? improvedResume.achievements
          : "",
    };

    return res.status(200).json({
      message: "Complete resume improved successfully",
      result: safeResume,
    });
  } catch (parseError) {
    console.error(
      "Unable to parse improved resume JSON:",
      generatedText
    );

    return res.status(500).json({
      message: "AI returned an invalid resume format. Please try again.",
    });
  }
}

// Other AI options continue returning normal text

    return res.status(200).json({
      message: "AI content generated successfully",
      result: generatedText,
    });
 } catch (error) {
  console.error("Gemini AI Error:", error);

  if (error.status === 429) {
    return res.status(429).json({
      message:
        "AI request limit reached. Please wait a little and try again.",
    });
  }

  if (error.status === 503) {
    return res.status(503).json({
      message:
        "AI service is temporarily busy. Please try again shortly.",
    });
  }

  return res.status(500).json({
    message: "Unable to generate AI content",
  });
}

});
module.exports = router;