import { BASE_URL } from "../../constants/BASE_URL";
import { useNavigate } from "react-router-dom";
import useForms from "../../hooks/useForms";
import { formatDistanceToNow } from 'date-fns';
import { goToApplicationsReceived, goToBootcampDetailPage, goToLoginPage } from "../../router/Coordinator";
import useProtectedPage from "../../hooks/useProtectedPage";
import {
  Container, Header, H1, Div, SearchInputContainer, Background, P
} from "../Home/HomeStyled";
import {
  Job, JobFields, PostContainer, DeleteContainer
} from "./HomeEmployeesStyled";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from 'react-icons/fa';

export const HomeEmployees = () => {
  const navigate = useNavigate();
  const { form, onChange, cleanForm } = useForms({ company: "", bootcamp: "", companyDescription: "", bootcampDescription: "" });
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postBox, setPostBox] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newBootcamp, setNewBootcamp] = useState("");
  const [newCompanyDescription, setNewCompanyDescription] = useState("");
  const [newBootcampDescription, setNewBootcampDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [jobId, setJobId] = useState("");

  useProtectedPage();

  const logout = () => {
    localStorage.removeItem("token")
    goToLoginPage(navigate)
  };

  const postJob = () => {
    setPostBox(!postBox)
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
  }, []);

  const sendJob = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("token");
      const body = {
        company: form.company,
        bootcamp: form.bootcamp,
        companyDescription: form.companyDescription,
        bootcampDescription: form.bootcampDescription,

      };
      await axios.post(`${BASE_URL}/jobs`, body, {
        headers: {
          Authorization: userToken,
        },
      });
      fetchJobs()
      cleanForm()
    } catch (error) {
      alert(error?.response?.data);
      console.error(error?.response?.data);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchInput.toLowerCase()) ||
      job.bootcamp.toLowerCase().includes(searchInput.toLowerCase())
  );
  const filteredJobsReversed = [...filteredJobs].reverse();
  const formatAppliedAt = (appliedAt) => {
    return formatDistanceToNow(new Date(appliedAt), { addSuffix: true });
  };

  const editJob = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("token");
      const body = {
        company: newCompany,
        bootcamp: newBootcamp,
        companyDescription: newCompanyDescription,
        bootcampDescription: newBootcampDescription
      };
      await axios.put(`${BASE_URL}/jobs/${jobId}`, body, {
        headers: {
          Authorization: userToken,
        }
      });
      closeEdit()
      fetchJobs()
    } catch (error) {
      alert(error?.response?.data);
      console.error(error?.response?.data);
    }
  };
  const editState = async (jobId) => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs/${jobId}`);
      setNewCompany(response.data.company);
      setNewBootcamp(response.data.bootcamp);
      setNewCompanyDescription(response.data.company_description);
      setNewBootcampDescription(response.data.bootcamp_description);
      setIsEditing(!isEditing)
      setJobId(jobId)
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const closeEdit = () => {
    setIsEditing(!isEditing)
  };

  const handleNewCompany = (event) => {
    setNewCompany(event.target.value);
  };
  const handleNewBootcamp = (event) => {
    setNewBootcamp(event.target.value);
  };
  const handleNewCompanyDescription = (event) => {
    setNewCompanyDescription(event.target.value);
  };
  const handleNewBootcampDescription = (event) => {
    setNewBootcampDescription(event.target.value);
  };

  const closeDeleteBox = () => {
    setIsDeleting(false)
  };
  const deleteBox = (jobId) => {
    setJobId(jobId)
    setIsDeleting(!isDeleting)
  };
  const deleteJob = async () => {
    try {
      const userToken = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: userToken,
        }
      });
      fetchJobs()
      closeDeleteBox()
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Container>
        {postBox && (
          <>
            <Background></Background>
            <PostContainer>
              <button className="close" onClick={postJob}>+</button>
              <form onSubmit={sendJob}>
                <div>
                  <label>Company</label>
                  <input
                    placeholder="company"
                    type="text"
                    name="company"
                    required
                    value={form.company}
                    onChange={onChange}
                  />
                  <label>company Description</label>
                  <textarea
                    placeholder="company Description"
                    type="text"
                    name="companyDescription"
                    required
                    value={form.companyDescription}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <label>Bootcamp</label>
                  <input
                    placeholder="bootcamp"
                    type="text"
                    name="bootcamp"
                    required
                    value={form.bootcamp}
                    onChange={onChange}
                  />
                  <label>bootcampDescription </label>
                  <textarea
                    placeholder="bootcamp Description"
                    type="text"
                    name="bootcampDescription"
                    required
                    value={form.bootcampDescription}
                    onChange={onChange}
                  />
                </div>

                <button>Post</button>
              </form>
            </PostContainer>
          </>
        )}
        <Header>
          <button onClick={postJob}>Post bootcamps</button>
          <button onClick={() => goToApplicationsReceived(navigate)}>Received Applications</button>
          <button onClick={logout}>Logout</button>
        </Header>
        <H1>ADMIN ACCESS</H1>
        <h3>Welcome to the admin page</h3>

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
              <div>Posted</div>
            </JobFields>
            {filteredJobsReversed.map((job, indice) => (
              <Job>
                <div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{indice + 1}{job.company}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{job.bootcamp}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{formatAppliedAt(job.created_at)}</div>
                <button type="button" onClick={() => editState(job.id)}>Edit</button>
                <button onClick={() => deleteBox(job.id)}>delete</button>
              </Job>
            ))}
          </Div>
        )}

        {isEditing && (
          <>
            <Background></Background>
            <PostContainer>
              <button className="close" onClick={closeEdit}>+</button>
              <form onSubmit={editJob}>
                <div>
                  <label>Company</label>
                  <input
                    placeholder="company"
                    type="text"
                    name="company"
                    required
                    value={newCompany}
                    onChange={handleNewCompany}
                  />
                  <label>company Description</label>
                  <textarea
                    placeholder="company Description"
                    type="text"
                    name="companyDescription"
                    required
                    value={newCompanyDescription}
                    onChange={handleNewCompanyDescription}
                  />
                </div>

                <div>
                  <label>Bootcamp</label>
                  <input
                    placeholder="bootcamp"
                    type="text"
                    name="bootcamp"
                    required
                    value={newBootcamp}
                    onChange={handleNewBootcamp}
                  />
                  <label>bootcampDescription </label>
                  <textarea
                    placeholder="bootcamp Description"
                    type="text"
                    name="bootcampDescription"
                    required
                    value={newBootcampDescription}
                    onChange={handleNewBootcampDescription}
                  />
                </div>
                <button>edit</button>
              </form>
            </PostContainer>
          </>
        )}

        {isDeleting && (<>
          <Background></Background>
          <DeleteContainer>
            <div>
              Are you sure you want to delete the bootcamp post?
            </div>
            <div>
              <button onClick={closeDeleteBox}>cancel</button>
              <button onClick={deleteJob}>Delete</button>
            </div>
          </DeleteContainer>
        </>
        )}
      </Container>
    </>
  );
};