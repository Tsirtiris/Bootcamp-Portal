import { BASE_URL } from "../../constants/BASE_URL";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import useForms from "../../hooks/useForms";
import { goToApplicationsReceived, goToHome, goToHomeEmployees, goToJobsApplyed, goToLoginPage, goToSignUpPage } from "../../router/Coordinator";
import {
 H1, PostContainer, SearchInputContainer, Background, P
} from "../Home/HomeStyled";
import { ProfileContainer, Div } from "./BootcampDetailPageStyled";
import { Header, Container } from "../ProfilePage/ProfilePageStyled";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const BootcampDetailPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { jobId } = useParams();
  const [tokenExisist, setTokenExisist] = useState(false);
  const [applyBoxOpen, setApplyBoxOpen] = useState(false);
  const { form, onChange, cleanForm } = useForms({ cv: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [cvFilePath, setCvFilePath] = useState(""); 
  const [cvUploadProgress, setCvUploadProgress] = useState(0);

  const logout = () => {
    localStorage.removeItem("token")
    goToHome(navigate)
  };

  const closeApplyBox = () => {
    setApplyBoxOpen(false)
    setCvUploadProgress(0)
  };

  const handleCvUpload = (event) => {
    const fileInput = event.target;
  
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
  
      // Save the file path to the state
      const filePath = `./cv_files/${file.name}`;
      setCvFilePath(filePath);
      setCvFile(file);
    }
  };  

  const apply = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("token");
      
      // Check if a file was selected
      if (!cvFile) {
        console.error("CV file is required");
        return;
      }
  
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("cv", cvFile);
  
      // Make a POST request with the file
      const response = await axios.post(`${BASE_URL}/applications`, formData, {
        headers: {
          Authorization: userToken,
          "Content-Type": "multipart/form-data", // Make sure to set the content type for file upload
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setCvUploadProgress(progress);
        },
      });
  
      console.log("Application submitted:", response.data);
  
      cleanForm();
      setApplyBoxOpen(false);
      fetchUserApplications();
      setCvUploadProgress(0);
    } catch (error) {
      console.error(error?.response?.data);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs/${jobId}`);
      setJobs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchUserApplications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/applications/user`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const userApplications = response.data;
      setAppliedJobs(userApplications);
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  const checkIfAdmin = () => {
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    if (userId === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setTokenExisist(true)
      checkIfAdmin()
      fetchUserApplications()
    } else {
      setTokenExisist(false)
    }
  }, [navigate, tokenExisist]);

  const applyBox = (id) => {
    setApplyBoxOpen(true)
  };

  const formatAppliedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  return (
    <>
      <Container>
        {isAdmin && (
          <Header>
            <button onClick={() => goToHomeEmployees(navigate)}>Bootcamps</button>
            <button onClick={() => goToApplicationsReceived(navigate)}>Received Applications</button>
            <button onClick={logout}>Logout</button>
          </Header>
        )}

        {tokenExisist && !isAdmin && (
          <Header>
            <button onClick={() => goToJobsApplyed(navigate)}>My applications</button>
            <button onClick={() => goToHome(navigate)}>Find more bootcamps</button>
            <button onClick={logout}>Logout</button>
          </Header>
        )}

        {!tokenExisist && (
          <Header>
            <button onClick={() => goToLoginPage(navigate)}>Login</button>
            <button onClick={() => goToSignUpPage(navigate)}>Sign up</button>
          </Header>
        )}

        <H1>Bootcamp Page</H1>
        <h3></h3>

        {isLoading ? (
          <div>
            <h2>Loading...</h2>
            <p>The project was deployed for free, so it may take a few seconds to load. If delayed, try refreshing the page and avoid having too many open tabs.</p>
          </div>
        ) : (

          <ProfileContainer>
            <Div>
              <h2>{jobs.company}</h2>
              <p>{jobs.bootcamp}</p>
              <div>{jobs.company_description}</div>
              <div className="box">
                {jobs.bootcamp_description}
              </div>
              <div>{"Posted "}{formatAppliedAt(jobs.created_at)}</div>
              <div className="apply">
                {!tokenExisist && <button onClick={() => goToLoginPage(navigate)}>login to apply</button>}
                {tokenExisist && !isAdmin && (
                  <>
                    {appliedJobs.some((appliedJob) => appliedJob.job_id === jobs.id) ? (
                      appliedJobs
                        .filter((appliedJob) => appliedJob.job_id === jobs.id)
                        .map((appliedJob) => (
                          <p key={appliedJob.id}>{appliedJob.status}</p>
                        ))
                    ) : (
                      <button onClick={() => applyBox(jobs.id)}>Click to apply</button>
                    )}
                  </>
                )}

              </div>
            </Div>
          </ProfileContainer>
        )}
{applyBoxOpen && (<>
          <Background></Background>
          <PostContainer>
            <form onSubmit={apply}>
              <label>CV:</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(event) => handleCvUpload(event)}
                required
              />
{cvUploadProgress < 100 ? (
  <div>Please wait for the CV to be uploaded...</div>
) : (
  <div>CV Uploaded Successfully!</div>
)}

              <button>Apply</button>
            </form>
            <button onClick={closeApplyBox}>cancel</button>
          </PostContainer>
        </>
        )}
      </Container>
    </>
  );
};