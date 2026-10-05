import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Education.css";

function Education() {
  const navigate = useNavigate();

  const isEditing =
  localStorage.getItem("resumeMode") === "edit";

const savedEducation = isEditing
  ? JSON.parse(localStorage.getItem("educationData") || "{}")
  : {};

const [educationData, setEducationData] = useState({
  level: savedEducation.level || "",
  degree: savedEducation.degree || "",
  college: savedEducation.college || "",
  department: savedEducation.department || "",
  score: savedEducation.score || "",
});
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEducationData({
      ...educationData,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (
      !educationData.degree ||
      !educationData.college ||
      !educationData.department ||
      !educationData.score
    ) {
      alert("Please fill in all required fields");
      return;
    }

    localStorage.setItem("educationData",JSON.stringify(educationData));

    navigate("/ResumeDetails");
  };

  return (
    <div className="education-page">


      <nav className="education-navbar">

        <div className="education-logo" onClick={() => navigate("/dashboard")}>
          <span>AI</span> Resume
        </div>

        <div className="education-step"> Step 2 of 6 </div>

        <button className="education-exit" onClick={() => navigate("/dashboard")}> Save & Exit </button>

      </nav>



      <div className="education-progress-container">

        <div className="education-progress-info">
          <span>Education</span>
          <span>33% Complete</span>
        </div>

        <div className="education-progress-bar">
          <div className="education-progress-fill"></div>
        </div>

      </div>



      <main className="education-main">

        <div className="education-heading">

          <p className="education-label"> RESUME BUILDER </p>

          <h1>
            Tell us about your
            <span> education</span>
          </h1>

          <p>
            Add your academic background to showcase your
            qualifications to recruiters.
          </p>

        </div>



        <div className="education-card">

          <div className="education-card-title">

            <div className="education-icon">🎓 </div>

            <div>
              <h2>Education Details</h2>
              <p>Your academic qualifications</p>
            </div>

          </div>


          <form onSubmit={handleNext}>

            <div className="education-form-grid">

              <div className="education-form-group">

                <label> Education Level </label>

                <select name="level" value={educationData.level} onChange={handleChange} >
                  <option value="College"> College / University </option>

                  <option value="School"> School </option>

                  <option value="Diploma"> Diploma </option>
                </select>

              </div>


              <div className="education-form-group">

                <label>
                  Degree <span>*</span>
                </label>

                <input type="text" name="degree" placeholder="Example: B.Tech" value={educationData.degree} onChange={handleChange}  required />

              </div>


              <div className="education-form-group full">

                <label>
                  College / University <span>*</span>
                </label>

                <input type="text" name="college" placeholder="Enter college / university name" value={educationData.college} onChange={handleChange} required/>

              </div>


              <div className="education-form-group">

                <label>
                  Department / Branch <span>*</span>
                </label>

                <input type="text" name="department" placeholder="Example: Information Technology" value={educationData.department} onChange={handleChange} required/>

              </div>



              <div className="education-form-group">

                <label>
                  CGPA / Percentage <span>*</span>
                </label>

                <input type="text" name="score" placeholder="Example: 8.5 CGPA" value={educationData.score} onChange={handleChange} required />

              </div>

            </div>


            <div className="education-tip">

              <div className="education-tip-icon"> 💡 </div>

              <div>
                <strong>Education tip</strong>

                <p>
                  Add your most recent qualification first.
                  Use your actual CGPA or percentage.
                </p>
              </div>

            </div>


            <div className="education-actions">

              <button type="button" className="education-back-btn" onClick={() => navigate("/create-resume")}>  ← Back </button>

              <button type="submit" className="education-next-btn"> Save & Continue → </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Education;