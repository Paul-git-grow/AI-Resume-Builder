import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateResume.css";

function CreateResume() {
  const navigate = useNavigate();


  const resumeMode = localStorage.getItem("resumeMode") || "create";
  const isEditing = resumeMode === "edit";
  const savedPersonalData = isEditing? JSON.parse(
      localStorage.getItem("personalData") || "{}"
    )
  : {};


 const [formData, setFormData] = useState({
  fullName: savedPersonalData.fullName || "",
  email: savedPersonalData.email || "",
  phone: savedPersonalData.phone || "",
  location: savedPersonalData.location || "",
  linkedin: savedPersonalData.linkedin || "",
  github: savedPersonalData.github || "",
});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({...formData, [name]: value,});
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    localStorage.setItem("personalData",
      JSON.stringify(formData)
    );

    navigate("/education");
  };

  return (
    <div className="create-page">

      <nav className="create-navbar">

        <div className="create-logo" onClick={() => navigate("/dashboard")}>
          <span>AI</span> Resume
        </div>

        <div className="create-step-text"> Step 1 of 6 </div>

        <button className="exit-btn" onClick={() => navigate("/dashboard")}> Save & Exit </button>

      </nav>


      <div className="progress-container">

        <div className="progress-info">
          <span>Personal Details</span>
          <span>17% Complete</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>

      </div>


      <main className="create-main">

        <div className="create-heading">

          <div>
            <p className="create-label"> RESUME BUILDER</p>

            <h1> Let's start with your
              <span> personal details</span>
            </h1>

            <p> Tell us about yourself. These details will appear at the top of your resume. </p>
          </div>

        </div>


        <div className="personal-card">

          <div className="card-title">

            <div className="card-icon"> 👤 </div>

            <div>
              <h2>Personal Information</h2>
              <p>Basic information recruiters need</p>
            </div>

          </div>


          <form onSubmit={handleNext}>

            <div className="form-grid">

              <div className="form-group full-width">

                <label> Full Name <span>*</span></label>

                <input type="text" name="fullName" placeholder="Enter your Name" value={formData.fullName} onChange={handleChange} required />

              </div>
            

              <div className="form-group">

                <label> Email Address <span>*</span></label>

                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />

              </div>


    
              <div className="form-group">

                <label> Phone Number <span>*</span> </label>

                <input type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />

              </div>


              <div className="form-group">

                <label> Location * </label>

                <input type="text" name="location" placeholder="Chennai, Tamil Nadu" value={formData.location} onChange={handleChange}/>

              </div>


              
              <div className="form-group">

                <label> LinkedIn Profile </label>

                <input type="url" name="linkedin" placeholder="https://linkedin.com/in/yourname" value={formData.linkedin} onChange={handleChange} />

              </div>



              <div className="form-group full-width">

                <label> GitHub Profile </label>

                <input type="url" name="github" placeholder="https://github.com/yourname" value={formData.github} onChange={handleChange}/>

              </div>

            </div>



            <div className="resume-tip">

              <div className="tip-icon">💡</div>

              <div>
                <strong>Resume tip</strong>

                <p>
                  Use the same name and contact information
                  that you use on your LinkedIn profile.
                </p>
              </div>

            </div>



            <div className="form-actions">

              <button type="button" className="back-btn" onClick={() => navigate("/dashboard")}>← Back </button>

              <button type="submit" className="next-btn"> Save & Continue → </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default CreateResume;