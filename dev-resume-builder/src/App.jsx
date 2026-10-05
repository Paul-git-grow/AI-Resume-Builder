import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./mycomponents/home";
import Login from "./mycomponents/login";
import Signup from "./mycomponents/Signup";
import Dashboard from "./mycomponents/Dashboard";
import CreateResume from "./mycomponents/CreateResume";
import Education from "./mycomponents/Education";
import ResumeDetails from "./mycomponents/ResumeDetails";
import AIAssistance from "./mycomponents/AiAssistance";
import Templates from "./mycomponents/Templates";
import ResumePreview from "./mycomponents/ResumePreview";
import MyResumes from "./mycomponents/MyResumes";
import Profile from "./mycomponents/Profile";
import ATSChecker from "./mycomponents/ATSChecker";
import JobMatcher from "./mycomponents/Jobmatcher";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/create-resume" element={<CreateResume />} />

        <Route path="/Education" element={<Education />} />

        <Route path="/ResumeDetails" element={<ResumeDetails />} />

        <Route path="/AiAssistance" element={<AIAssistance />} />

        <Route path="/Templates" element={<Templates />} />

        <Route path="/ResumePreview" element={<ResumePreview />} />

        <Route path="/MyResumes" element={<MyResumes />} />

        <Route path="/Profile" element={<Profile />} />

        <Route path="/ats-checker" element={<ATSChecker />} />

        <Route path="/job-matcher" element={<JobMatcher />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;