import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET PROFILE FROM MONGODB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Unable to load profile");

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUserId");
            navigate("/login");
          }

          return;
        }

        setProfile({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          linkedin: data.user.linkedin || "",
          github: data.user.github || "",
        });
      } catch (error) {
        console.error("Profile Error:", error);
        alert("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);


  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // UPDATE PROFILE IN MONGODB
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (!profile.fullName.trim() || !profile.email.trim()) {
        alert("Full name and email are required");
        return;
      }

      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            linkedin: profile.linkedin,
            github: profile.github,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update profile");

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUserId");
          navigate("/login");
        }

        return;
      }

      setProfile({
        fullName: data.user.fullName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        location: data.user.location || "",
        linkedin: data.user.linkedin || "",
        github: data.user.github || "",
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update Profile Error:", error);
      alert("Unable to connect to server");
    } finally {
      setSaving(false);
    }
  };


  // LOADING
  if (loading) {
    return (
      <div className="profile-page">
        <p style={{ textAlign: "center", padding: "50px" }}>
          Loading profile...
        </p>
      </div>
    );
  }


  return (
    <div className="profile-page">

      <nav className="profile-navbar">

        <div
          className="profile-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span>AI</span> Resume
        </div>

        <h1>My Profile</h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="profile-back-btn"
        >
          Dashboard
        </button>

      </nav>


      <main className="profile-main">

        <div className="profile-heading">

          <p>ACCOUNT</p>

          <h1>Your Profile</h1>

          <span>
            Manage your account information and profile details.
          </span>

        </div>


        <div className="profile-card">

          <div className="profile-card-header">

            <div className="profile-icon">
              👤
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>This information belongs to your account</p>
            </div>

          </div>


          <form onSubmit={handleSave}>

            <div className="profile-grid">

              <div className="profile-group full">

                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="profile-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="profile-group">

                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />

              </div>


              <div className="profile-group">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />

              </div>


              <div className="profile-group">

                <label>LinkedIn Profile</label>

                <input
                  type="url"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                />

              </div>


              <div className="profile-group full">

                <label>GitHub Profile</label>

                <input
                  type="url"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="profile-actions">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="profile-cancel-btn"
              >
                Cancel
              </button>


              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Profile;