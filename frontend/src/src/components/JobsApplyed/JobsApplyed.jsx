import { BASE_URL } from "../../constants/BASE_URL";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { goToHome, goToProfilePage, goToBootcampDetailPage } from "../../router/Coordinator";
import useProtectedPage from "../../hooks/useProtectedPage";
import {
  Container, Header, H1, Div
} from "../Home/HomeStyled";
import {
  Job, JobFields
} from "../HomeEmployees/HomeEmployeesStyled";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from "react";

export const JobsApplyed = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useProtectedPage();

  const logout = () => {
    localStorage.removeItem("token")
    goToHome(navigate)
  };

  useEffect(() => {
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.id)
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/applications/user`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const applys = response.data;
      const updatedApplies = [];
      await Promise.all(
        applys.map(async (apply) => {
          try {
            const jobResponse = await axios.get(`${BASE_URL}/jobs/${apply.job_id}`, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            });
            const updatedApply = {
              ...apply,
              jobDetails: jobResponse.data,
            };
            updatedApplies.push(updatedApply);
            console.log(updatedApplies)
          } catch (error) {
            console.error('Error fetching job details:', error);
          }
        })
      );
      setJobs(updatedApplies);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);


  const formatAppliedAt = (appliedAt) => {
    return formatDistanceToNow(new Date(appliedAt), { addSuffix: true });
  };

  return (
    <>
      <Container>
        <Header>
          <button onClick={() => goToHome(navigate)}>Find More Bootcamps</button>
          <button onClick={() => goToProfilePage(navigate, userId)}>My Profile</button>
          <button onClick={logout}>Logout</button>
        </Header>

        <H1>Jobs Applied</H1>
        <h3>Keep applying to new jobs until you find one that fits you</h3>

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
              <div>Application sent</div>
              <div>Status</div>
            </JobFields>
            {jobs.reverse().map((job, indice) => (
              <Job>
                <div onClick={() => goToBootcampDetailPage(navigate, job.job_id)}>{job.jobDetails.company}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.job_id)}>{job.jobDetails.bootcamp}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.job_id)}>{formatAppliedAt(job.applied_at)}</div>
                <div onClick={() => goToBootcampDetailPage(navigate, job.job_id)}>{job.status}</div>
              </Job>
            ))}
          </Div>
        )}
      </Container>
    </>
  );
};