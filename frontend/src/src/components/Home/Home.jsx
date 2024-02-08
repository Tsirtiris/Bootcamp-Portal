import { BASE_URL } from "../../constants/BASE_URL";
import { useNavigate } from "react-router-dom";
import useForms from "../../hooks/useForms";
import { formatDistanceToNow } from 'date-fns';
import { goToLoginPage, goToSignUpPage, goToJobsApplyed, goToBootcampDetailPage, goToProfilePage, goToHomeEmployees } from "../../router/Coordinator";
import {
  Container, Header, Div, H1, PostContainer, SearchInputContainer, Background, P
} from "./HomeStyled";
import {
  Job, JobFields
} from "../HomeEmployees/HomeEmployeesStyled";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { FaSearch, FaTimes } from 'react-icons/fa';

export const Home = () => {
  const navigate = useNavigate();
  const [tokenExisist, setTokenExisist] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobId, setJobId] = useState("");
  const [userId, setUserId] = useState("");
  const [applyBoxOpen, setApplyBoxOpen] = useState(false);
  const { form, onChange, cleanForm } = useForms({ cv: "" });
  const [searchInput, setSearchInput] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [cvFilePath, setCvFilePath] = useState("");
  const [cvUploadProgress, setCvUploadProgress] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setTokenExisist(true)
      const token = localStorage.getItem("token")
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id)
      if (decodedToken.id === "admin") {
        goToHomeEmployees(navigate)
      }
    } else {
      setTokenExisist(false)
    }
  }, [navigate, tokenExisist]);

  const logout = () => {
    localStorage.removeItem("token")
    setTokenExisist(false)
    goToLoginPage(navigate)
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      setJobs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (tokenExisist) {
      fetchUserApplications();
    }
    
  }, [tokenExisist]);

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

  const applyBox = (id) => {
    setApplyBoxOpen(true)
    setJobId(id)
  };

  const closeApplyBox = () => {
    setApplyBoxOpen(false)
    setCvUploadProgress(0)
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
  

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  const formatAppliedAt = (appliedAt) => {
    return formatDistanceToNow(new Date(appliedAt), { addSuffix: true });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchInput.toLowerCase()) ||
      job.bootcamp.toLowerCase().includes(searchInput.toLowerCase())
  );
  const filteredJobsReversed = [...filteredJobs].reverse();

  const handleCvUpload = (event) => {
    const fileInput = event.target;
  
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
  
      // Save the file path to the state
      const filePath = `./cv_files/${file.name}`;
      setCvFilePath(filePath);
      setCvFile(file);
      setCvUploadProgress(100)
    }
  };  

  return (
    <>
      <Container>
        {tokenExisist ? (<Header>
          <button onClick={() => goToJobsApplyed(navigate)}>My applications</button>
          <button onClick={() => goToProfilePage(navigate, userId)}>My Profile</button>
          <button onClick={logout}>Logout</button>
        </Header>) : (<Header>
          <button onClick={() => goToLoginPage(navigate)}>Login</button>
          <button onClick={() => goToSignUpPage(navigate)}>Sign up</button>
        </Header>)
        }
        <H1>Find bootcamps</H1>
        <h4>Search for the best bootcamp opportunity for you</h4>

        <P>What are you looking for?</P>
        <SearchInputContainer>
          <input
            type="text"
            placeholder="Search by company or bootcamp"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')}>
              <FaTimes />
            </button>
          )}
          {!searchInput && <button><FaSearch /></button>}
        </SearchInputContainer>

        {isLoading ? (
          <div>
            <h2>Loading...</h2>
            <p>The project was deployed for free, so it may take a few seconds to load. If delayed, try refreshing the page and avoid having too many open tabs.</p>
          </div>
        ) : (
          <Div>
            <JobFields>
              <div>Company</div>
              <div>Bootcamp</div>
              <div>posted</div>
            </JobFields>
            {filteredJobsReversed.map((job, indice) => (
              <Job>
                <div onClick={() => goToBootcampDetailPage(navigate, job.id)}><p>{indice + 1}</p>{job.company}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{job.bootcamp}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{formatAppliedAt(job.created_at)}</div>
                <div className="applyed">
                  {!tokenExisist ? (
                    <button onClick={() => goToLoginPage(navigate)}>
                      Login to apply
                    </button>
                  ) : appliedJobs.some(
                    (appliedJob) => appliedJob.job_id === job.id
                  ) ? (
                    <button className="text">Already applied</button>
                  ) : (
                    <button onClick={() => applyBox(job.id)}>Apply</button>
                  )}
                </div>
              </Job>
            ))}
          </Div>
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