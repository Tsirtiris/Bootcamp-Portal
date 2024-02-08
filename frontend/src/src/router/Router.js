import { BrowserRouter, Routes, Route } from "react-router-dom";
import {LoginPage} from "../components/LoginPage/LoginPage"
import {SignUpPage} from "../components/SignUpPage/SignUpPage"
import {Home} from "../components/Home/Home"
import {HomeEmployees} from "../components/HomeEmployees/HomeEmployees"
import {JobsApplyed} from "../components/JobsApplyed/JobsApplyed"
import {ApplicationsReceived} from "../components/ApplicationsReceived/ApplicationsReceived"
import {BootcampDetailPage} from "../components/BootcampDetailPage/BootcampDetailPage"
import {ProfilePage} from "../components/ProfilePage/ProfilePage"

export const Routess = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/Login/" element={<LoginPage />} />
        <Route path="/SignUp/" element={<SignUpPage />} />
        <Route path="/Home/" element={<Home/>} />
        <Route path="/HomeEmployees/" element={<HomeEmployees/>} />
        <Route path="/JobsApplyed/" element={<JobsApplyed/>} />
        <Route path="/ApplicationsReceived/" element={<ApplicationsReceived/>} />
        <Route path="/BootcampDetailPage/:jobId" element={<BootcampDetailPage/>} />
        <Route path="/ProfilePage/:userId" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
};