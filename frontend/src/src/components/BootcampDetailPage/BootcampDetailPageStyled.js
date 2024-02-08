import { styled } from "styled-components";

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
  div{
    padding: 15px 5px;
    border-top: 1px solid #143727;
    width: 400px;
    @media screen and (max-width: 500px) {
      width: 90%;
  }
    display: flex;
    
  }.apply{
      display: flex;
      align-items: center;
    justify-content: center;
    button{
      background-color: #143727;
      color: #E5E5E5;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: 1px solid #143727;
&:hover{
      background-color: transparent;
    color: #143727;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
    }
    }
  h2{
    margin-bottom: 0;
  }
`;

export const ProfileContainer = styled.div`
background-color: #FFCF07;
color: #143727;
display: flex;
border-radius: 20px;
flex-direction: column;
align-items: center;
justify-content: start;
@media screen and (max-width: 700px) {
      max-width: 90%;
  }
`;