export const goToLoginPage = (navigate) => {
  navigate("/Login/");
};
export const goToSignUpPage = (navigate) => {
  navigate(`/SignUp/`);
};
export const goToHome = (navigate) => {
  navigate(`/Home/`);
};
export const goToHomeEmployees = (navigate) => {
  navigate(`/HomeEmployees/`);
};
export const goToPostJob = (navigate) => {
  navigate(`/PostJob/`);
};
export const goToJobsApplyed = (navigate) => {
  navigate(`/JobsApplyed/`);
};
export const goToApplicationsReceived = (navigate) => {
  navigate(`/ApplicationsReceived/`);
};
export const goToBootcampDetailPage = (navigate,jobId) => {
  navigate(`/BootcampDetailPage/${jobId}/`);
};
export const goToProfilePage = (navigate,userId) => {
  navigate(`/ProfilePage/${userId}/`);
};