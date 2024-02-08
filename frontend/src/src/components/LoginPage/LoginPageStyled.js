import { styled } from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E5E5E5;
  color: #143727;
  width: 100vw;
    height: 100%;
    position: absolute;
    right: 0;
`;

export const Title = styled.h1`
  font-size: 3vw;
  font-weight: 700;
  text-transform: uppercase;
  color: #143727;
  margin: 0;
  margin-top: -3vw;
`;

export const Subtitle1 = styled.p`
  font-size: 16px;
  font-weight: 300;
  button{
    background-color: transparent;
    border: none;
    font-family: Anton;
    font-size: 16px;
    color: blue;
    cursor: pointer;
  }
  :hover{
    text-decoration: underline;
  }
`;

export const Subtitle2 = styled.p`
  font-size: 16px;
  font-weight: 300;
  color: gray;

  margin-top: -2vw;
  
`;

export const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 10%;
  span{
    position: relative;
    right: 30px;
    color: gray;
    scale: 1.1;
  }
  @media screen and (max-width: 450px) {
    span{
    position: relative;
    top: -45px;
    left: 100%;
  }
  }
`;

export const Input = styled.input`
  width: 250px;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 10px;
  height: 30px;
  border: 1px solid #D5D8DE;
  @media screen and (max-width: 450px) {
    width: 110%;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const H1 = styled.h1`
  font-size: 40px;
  width: 400px;
  text-align: center;
`;

export const H2 = styled.h1`
  font-size: 40px;
  width: 600px;
  text-align: center;
`;

export const SolidButton = styled.button`
  background: #143727;
  color: #E5E5E5;
  border-radius: 4px;
  cursor: pointer;
  width: 270px;
  height: 51px;
  font-size: 16px;
  margin-left: 0px;
  border: 1px solid #143727;
&:hover{
      background-color: transparent;
    color: #143727;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: start;
  margin-bottom: 20%;
  @media screen and (min-width: 760px) {
    margin-bottom: 20px;
  }
`;