import { BASE_URL } from "../../constants/BASE_URL";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { goToBootcampDetailPage, goToHome, goToHomeEmployees, goToProfilePage } from "../../router/Coordinator";
import useProtectedPage from "../../hooks/useProtectedPage";
import {
  Container, Header, H1, Div, SearchInputContainer, P
} from "../Home/HomeStyled";
import {
  Job, JobFields
} from "../HomeEmployees/HomeEmployeesStyled";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from 'react-icons/fa';

export const ApplicationsReceived = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  useProtectedPage();

  const logout = () => {
    localStorage.removeItem("token")
    goToHome(navigate)
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/applications`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setApplications(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const changeStatus = async (event, applicationId, status) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("token");
      const body = {
        status: status
      };
      await axios.put(`${BASE_URL}/applications/${applicationId}`, body, {
        headers: {
          Authorization: userToken,
        }
      });
      fetchApplications()
    } catch (error) {
      alert(error?.response?.data);
      console.error(error?.response?.data);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredApplications = applications.filter((application) =>
    application.company.toLowerCase().includes(searchInput.toLowerCase()) ||
    application.bootcamp.toLowerCase().includes(searchInput.toLowerCase()) ||
    application.applications.some((app) =>
      app.username.toLowerCase().includes(searchInput.toLowerCase()) ||
      app.status.toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  const formatAppliedAt = (appliedAt) => {
    return formatDistanceToNow(new Date(appliedAt), { addSuffix: true });
  };
  const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  const filteredApplicationsReversed = [...filteredApplications].reverse();

  return (
    <>
      <Container>
        <Header>
          <button onClick={() => goToHomeEmployees(navigate)}>Bootcamps</button>
          <button onClick={logout}>Logout</button>
        </Header>

        <H1>Received applications</H1>
        <h3>Find the best cadidate to work with you</h3>

        <P>What are you looking for?</P>
        <SearchInputContainer>
          <input
            type="text"
            placeholder="Search by company, bootcamp, userName or status"
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
              <div>CV</div>
              <div>User name</div>
              <div>Status</div>
              <div>Application sent</div>
              <div></div>
            </JobFields>
            {filteredApplicationsReversed.map((job) => (
              <>
                {job.applications.map((application) => (<Job>
                  <><div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{job.company}</div>
                    <div onClick={() => goToBootcampDetailPage(navigate, job.id)}>{job.bootcamp}</div>
                    <div>
                    <a
                          href={`../../../../../backend/src/uploads/${application.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open CV
                        </a>
                    </div>
                    <div onClick={() => goToProfilePage(navigate, application.user_id)}>{capitalize(application.username)}</div>
                    <div className="noUnderline">{application.status}</div>
                    <div onClick={() => goToProfilePage(navigate, application.user_id)}>{formatAppliedAt(application.applied_at)}</div>
                    <button onClick={(event) => changeStatus(event, job.application_id, "Accepted")}>Accept</button>
                    <button onClick={(event) => changeStatus(event, job.application_id, "Declined")}>Decline</button>
                    <button onClick={(event) => changeStatus(event, job.application_id, "Waiting")}>Wait</button>
                  </>
                </Job>))}

              </>
            ))}
          </Div>
        )}
      </Container>
    </>
  );
};