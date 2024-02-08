import { BASE_URL } from "../../constants/BASE_URL";
import { useNavigate } from "react-router-dom";
import useForms from "../../hooks/useForms";
import { goToHome, goToSignUpPage, goToHomeEmployees } from "../../router/Coordinator";
import {
  Container,
  Subtitle1,
  Input,
  SolidButton,
  ButtonContainer,
  Form,
  InputContainer,
  H1
} from "../LoginPage/LoginPageStyled";
import {
  Header,
} from "../ProfilePage/ProfilePageStyled";
import axios from "axios";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { form, onChange } = useForms({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfAdmin = () => {
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    if (userId === "admin") {
      goToHomeEmployees(navigate);
    } else {
      goToHome(navigate);
    }
  }

  const sendLogin = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const body = {
        email: form.email,
        password: form.password,
      };
      const res = await axios.post(`${BASE_URL}/login`, body);
      localStorage.setItem("token", res.data.token);
      checkIfAdmin()
    } catch (error) {
      alert(error?.response?.data);
      console.error(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header>
        <button onClick={() => goToHome(navigate)}>Back to home</button>
      </Header>

      <Container>
        <H1>Log in to apply to new bootcamps</H1>
        <form onSubmit={sendLogin}>
          <Form>
            <InputContainer>
              <label>Email</label>
              <Input
                placeholder="anne.carry@mail.com"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
              />
              <label>Password</label>
              <div>
                <Input
                  placeholder="Password123"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={onChange}
                />
              </div>
            </InputContainer>
          </Form>
          <ButtonContainer>
            <SolidButton>Log in</SolidButton>
          </ButtonContainer>
        </form>
        <Subtitle1>Dont have an account yet?
          <button onClick={() => goToSignUpPage(navigate)}>
            Create an account
          </button>
        </Subtitle1>

        {isLoading && <div>Loading...Please wait</div>}
      </Container>
    </>
  );
};