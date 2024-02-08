import axios from "axios";
import { BASE_URL } from "../../constants/BASE_URL";
import useForms from "../../hooks/useForms";
import { useNavigate } from "react-router-dom";
import { goToHome, goToLoginPage } from "../../router/Coordinator"
import {
  Container,
  Subtitle1,
  Input,
  SolidButton,
  H2,
  Icon,
  ButtonContainer,
  Form,
  InputContainer,
} from "../LoginPage/LoginPageStyled";
import {
  Header,
} from "../ProfilePage/ProfilePageStyled";
import { useState } from "react";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { form, onChange } = useForms({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      const res = await axios.post(`${BASE_URL}/signup`, body);
      localStorage.setItem("token", res.data.token);
      goToHome(navigate);
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
        <H2>Sign up</H2>
        <form onSubmit={signUp}>
          <Form >
            <InputContainer>
              <label>Name</label>
              <Input placeholder="Anne Carry"
                id="name"
                name="name"
                type="name"
                required
                value={form.name}
                onChange={onChange}
              />
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
                  type="text"
                  name="password"
                  required
                  value={form.password}
                  onChange={onChange}
                />
              </div>

            </InputContainer>

            <ButtonContainer>
              <SolidButton>Create an acount</SolidButton>
            </ButtonContainer>
          </Form>
        </form>
        <Subtitle1>Already have an acount? Click here to
          <button onClick={() => goToLoginPage(navigate)}>
            Login
          </button>
        </Subtitle1>
        {isLoading && <div>Loading...Please wait</div>}
      </Container>
    </>
  )
}