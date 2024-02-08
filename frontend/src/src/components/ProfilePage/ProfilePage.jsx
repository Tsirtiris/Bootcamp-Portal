import { BASE_URL } from "../../constants/BASE_URL";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import noProfileImage from "../../../assets/noUser.JPG";
import { goToApplicationsReceived, goToHome, goToJobsApplyed, goToLoginPage, goToProfilePage, goToSignUpPage } from "../../router/Coordinator";
import useProtectedPage from "../../hooks/useProtectedPage";
import {
  H1, Background
} from "../Home/HomeStyled";
import {
  Div, SettingsContainer, Header, ApplicationsDiv, UserProfilePicture, Container, ProfileHeader, ProfileContainer, EditButton, JobFields, Job
} from "./ProfilePageStyled";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangeName, setIsChangeName] = useState(false);
  const [isChangePhoto, setIsChangePhoto] = useState(false);
  const [isChangeLastName, setIsChangeLastName] = useState(false);
  const [isChangeEmail, setIsChangeEmail] = useState(false);
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newWorkExperience, setNewWorkExperience] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newProfilePhoto, setNewProfilePhoto] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const { userId } = useParams();
  const [applications, setApplications] = useState([]);

  useProtectedPage();

  const logout = () => {
    localStorage.removeItem("token")
    goToHome(navigate)
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      setUser(response.data);
      setNewName(response.data.name)
      setNewEmail(response.data.email)
      setNewLastName(response.data.last_name)
      setNewCity(response.data.city)
      setNewBio(response.data.bio)
      setNewWorkExperience(response.data.work_experience)
      setNewEducation(response.data.education)
      setNewProfilePhoto(response.data.profile_photo)
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    checkIfUser()
  }, []);

  const checkIfUser = () => {
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token);
    const decodedUserId = decodedToken.id;
    if (decodedUserId === userId) {
      setIsUser(true);
    }
    else if (decodedUserId === "admin") {
      setIsAdmin(true);
      fetchApplications()
    }
    else {
      setIsUser(false);
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/applications/?userId=${userId}`, {
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

  const editState = () => {
    setIsEditing(!isEditing)
  };
  const closeEditState = () => {
    setIsEditing(false)
  };

  const capitalize = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };


  const edit = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("token");
      const body = {
        name: newName,
        bio: newBio,
        email: newEmail,
        lastName: newLastName,
        city: newCity,
        workExperience: newWorkExperience,
        education: newEducation,
        profilePhoto: newProfilePhoto,
      };

      await axios.put(`${BASE_URL}/users`, body, {
        headers: {
          Authorization: userToken,
        },
      });

      closeEditState();
      fetchUserInfo();
      closeSettings();
    } catch (error) {
      alert(error?.response?.data);
      console.error(error?.response?.data);
    }
  };

  const formatAppliedAt = (appliedAt) => {
    return formatDistanceToNow(new Date(appliedAt), { addSuffix: true });
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };
  const handleNewPhoto = (event) => {
    setNewProfilePhoto(event.target.value);
  };
  const handleNewEmail = (event) => {
    setNewEmail(event.target.value);
  };
  const handleNewLastName = (event) => {
    setNewLastName(event.target.value);
  };
  const handleNewBio = (event) => {
    setNewBio(event.target.value);
  };
  const handleNewCity = (event) => {
    setNewCity(event.target.value);
  };
  const handleNewWorkExperience = (event) => {
    setNewWorkExperience(event.target.value);
  };
  const handleNewEducation = (event) => {
    setNewEducation(event.target.value);
  };

  const openSettings = () => {
    setIsSettingsOpen(true)
  };
  const closeSettings = () => {
    setIsSettingsOpen(false)
    setIsChangeName(false)
    setIsChangeLastName(false)
    setIsChangeEmail(false)
  };
  const openOrCloseChangeName = () => {
    setIsChangeName(!isChangeName)
  };
  const openOrCloseChangeLastName = () => {
    setIsChangeLastName(!isChangeLastName)
  };
  const openOrCloseChangeEmail = () => {
    setIsChangeEmail(!isChangeEmail)
  };
  const openOrCloseChangePhoto = () => {
    setIsChangePhoto(!isChangePhoto)
  };
  const openOrCloseDeleteBox = () => {
    setIsDeleteBoxOpen(!isDeleteBoxOpen)
  };
  const openDeleteBox = () => {
    setIsDeleteBoxOpen(true)
    setIsChangeName(false)
    setIsChangeLastName(false)
    setIsChangeEmail(false)
  };

  const deleteUser = async () => {
    try {
      const userToken = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/user`, {
        headers: {
          Authorization: userToken,
        }
      });
      localStorage.removeItem("token");
      goToLoginPage(navigate);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Container>
        {isAdmin && (
          <Header>
            <button onClick={() => goToApplicationsReceived(navigate)}>Received Applications</button>
            <button onClick={logout}>Logout</button>
          </Header>
        )}

        {isUser && (<Header>
          <button onClick={() => goToJobsApplyed(navigate)}>My applications</button>
          <button onClick={() => goToHome(navigate)}>Find more bootcamps</button>
          <button onClick={logout}>Logout</button>
        </Header>)}

        {!isUser && !isAdmin && (
          <Header>
            <button onClick={() => goToLoginPage(navigate)}>Login</button>
            <button onClick={() => goToSignUpPage(navigate)}>Sign up</button>
          </Header>
        )}

        <H1>Profile page</H1>
        <h3></h3>

        {isLoading ? (
          <div>
            <h2>Loading...</h2>
            <p>The project was deployed for free, so it may take a few seconds to load. If delayed, try refreshing the page and avoid having too many open tabs!</p>
          </div>
        ) : (


          <ProfileContainer>

            <EditButton>
              {isUser && (<>
                <button type="button" onClick={openSettings}>Settings</button>
                <button onClick={editState}>{isEditing ? ("Cancel editing") : ("Edit Profile")}</button>
                {isEditing && (<button type="button" onClick={edit}>Save Changes</button>)}
              </>)}
            </EditButton>

            <ProfileHeader>
              <div>
                <UserProfilePicture>
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt={user.name} />
                  ) : (
                    <img src={noProfileImage} alt={user.name} />
                  )}
                  {isEditing && (<button onClick={openOrCloseChangePhoto}>edit</button>)}
                </UserProfilePicture>

              </div>
              <div>
                <h2>{capitalize(user.name)} {capitalize(user.last_name)}</h2>

                {!isEditing ?
                  (<div>{user.city}</div>) :
                  (<>
                    <div>
                      <label>City: </label>
                      <input
                        placeholder="City you're from, Country you're from"
                        type="text"
                        name="city"
                        value={newCity}
                        onChange={handleNewCity}
                      />
                    </div>


                    {isChangePhoto && (<div >
                      <label>Profile Photo: </label>
                      <input
                        type="text"
                        onChange={handleNewPhoto}
                        value={newProfilePhoto}
                        placeholder="Profile Photo"
                        name="profilePhoto"
                      />

                    </div>)}
                    {isChangePhoto && progressPercentage > 0 && (
                      <div className="progress">{progressPercentage}%</div>
                    )}

                  </>)}
              </div>


            </ProfileHeader>

            <Div>

              <div className="box">
                <h3>Bio</h3>
                {!isEditing ?
                  (<div>{user.bio}</div>) :
                  (<div>
                    <textarea
                      placeholder="Write your bio"
                      type="text"
                      name="bio"
                      value={newBio}
                      onChange={handleNewBio}
                    />
                  </div>
                  )}
              </div>

              <div className="box">
                <h3>Work Experience</h3>
                {!isEditing ?
                  (<div>{user.work_experience}</div>) :
                  (<div>
                    <textarea
                      placeholder="Write a little about your work experience"
                      type="text"
                      name="work"
                      value={newWorkExperience}
                      onChange={handleNewWorkExperience}
                    />
                  </div>
                  )}
              </div>

              <div className="box">
                <h3>Education</h3>
                {!isEditing ?
                  (<div>{user.education}</div>) :
                  (<div>
                    <textarea
                      placeholder="Write a little about your education history"
                      type="text"
                      name="education"
                      value={newEducation}
                      onChange={handleNewEducation}
                    />
                  </div>
                  )}
              </div>
            </Div>

          </ProfileContainer>)}

        {isAdmin && (
          <ApplicationsDiv>
            <JobFields>
              <div>company</div>
              <div>bootcamp</div>
              <div>cv</div>
              <div>user name</div>
              <div>status</div>
              <div>application sent</div>
              <div></div>
            </JobFields>
            {applications.slice().reverse().map((job) => (
              <>
                {job.applications.slice().reverse().map((application) => (<Job>
                  <><div>{job.company}</div>
                    <div>{job.bootcamp}</div>
                    <div>
                      <a
                        href={application.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        CV file
                      </a>
                    </div>
                    <div onClick={() => goToProfilePage(navigate, application.user_id)}>{capitalize(application.username)}</div>
                    <div>{application.status}</div>
                    <div>{formatAppliedAt(application.applied_at)}</div>
                    <button onClick={(event) => changeStatus(event, job.application_id, "Accepted")}>Accept</button>
                    <button onClick={(event) => changeStatus(event, job.application_id, "Declined")}>Decline</button>
                    <button onClick={(event) => changeStatus(event, job.application_id, "Waiting")}>Wait</button>
                  </>
                </Job>))}
              </>
            ))}
          </ApplicationsDiv>
        )}

        {isSettingsOpen && (<>
          <Background></Background>
          <SettingsContainer>
            <div className="box">
              <div onClick={openOrCloseChangeName}>Change first name</div>
              {isChangeName && (<input
                placeholder="New name"
                type="name"
                name="name"
                value={newName}
                onChange={handleNewName}
              />)}
            </div>
            <div className="box">
              <div onClick={openOrCloseChangeLastName}>Change last name</div>
              {isChangeLastName && (<input
                placeholder="New last name"
                type="name"
                name="lastName"
                value={newLastName}
                onChange={handleNewLastName}
              />)}
            </div>
            <div className="box">
              <div onClick={openOrCloseChangeEmail}>Change email</div>
              {isChangeEmail && (<input
                placeholder="New email"
                type="email"
                name="email"
                value={newEmail}
                onChange={handleNewEmail}
              />)}
            </div>
            <div className="box">
              <div onClick={openDeleteBox}>Delete account</div>
              {isDeleteBoxOpen && (
                <div className="delete">
                  <p>Are you sure you want to delete your account? This action is irreversible and will permanently remove all your data</p>
                  <button className="red" onClick={deleteUser}>Yes, I want to delete</button>
                  <button onClick={openOrCloseDeleteBox}>Cancel delete user</button>
                </div>
              )}
            </div>
            <button onClick={edit}>Save changes</button>
            <button onClick={closeSettings}>Cancel</button>
          </SettingsContainer>
        </>
        )}
      </Container>
    </>
  );
};