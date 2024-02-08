import { styled } from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: #E5E5E5;
  color: #143727;
  padding-bottom: 50px;
  width: 100vw;
  height: fit-content;
  min-height: 100%;
  position: absolute;
  right: 0;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  .box{
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    padding: 20px;
    border-bottom: 1px solid #dadada;
    max-width: 600px;
    width: 85vw;
    @media screen and (max-width: 900px) {
      max-width: 90%;
  }
  }
  h3{
    margin: 0;
    margin-bottom: 10px;
  }
  textarea{
    width: 37rem;
    height: 6rem;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
  }
`;

export const ApplicationsDiv = styled.div`
  background-color: #143727;
  padding: 5px;
  margin-top: 50px;
  color: #E5E5E5;
  a{
    color: #E5E5E5;
    &:hover{
      color: red;
    }
  }
`;

export const JobFields = styled.div`
  display: flex;
  div{
    padding: 5px;
    width: 12vw;
    font-weight: bold;
    margin: 0;
    
  }
`;

export const Job = styled.div`
  display: flex;
  .noUnderline:hover{
    text-decoration: none;
    cursor: default;
  }
  div{
    cursor: pointer;
    padding: 5px;
    border-top: 1px solid #dadada;
    width: 12vw;
    display: flex;
    align-items: center;
    &:hover{
      text-decoration: underline;
    }
    
  p{
      padding:0;
      margin-right: 10px;
      font-size: 12px
    }
  }
  .applyed{
    p{
      font-size: 14px;
    }
    &:hover{
      text-decoration: none;
    }
  }
  button{
    padding-left: 20px;
    background-color: transparent;
    border: none;
    text-decoration: underline;
    cursor: pointer;
    color: #dadada;
    &:hover{
      color: blue;
    }
  }
`;

export const UserProfilePicture = styled.div`
width: 100px;
margin: 20px;
@media screen and (max-width: 900px) {
  width: 60px;
  }
button{
  z-index: 2;
  position: absolute;
  margin-top: 90px;
  margin-left: -40px;
}
img{
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  @media screen and (max-width: 900px) {
    width: 60px;
  height: 60px;
  margin-top: 10px;
  left: 20px;
  }
  @media screen and (max-width: 500px) {
    width: 15vw;
  height: 15vw;
  margin-top: 15px;
  }
}
`;

export const ProfileHeader = styled.div`
margin-top: -60px;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
 
  border-bottom: 1px solid #E5E5E5;
  h2{
    margin: 0;
  }
  .editPhoto{
    position: relative;
  }
`;

export const ProfileContainer = styled.div`
background-color: #8D93D9;
color: #143727;
display: flex;
border-radius: 20px;
flex-direction: column;
align-items: center;
justify-content: start;
@media screen and (max-width: 900px) {
      max-width: 90%;
  }
`;

export const EditButton = styled.div`
display: flex;
z-index: 2;
margin: 20px;
align-self: flex-end;
gap: 20px; 
min-height: 35px;
button{
  height: fit-content;
  background-color: #E5E5E5;
color: #143727;
padding: 10px;
border-radius: 5px;
cursor: pointer;
border: 1px solid #E5E5E5;
&:hover{
      background-color: transparent;
    color: #E5E5E5;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  position: absolute;
  right: 0;
  margin: 20px;
  gap: 10px;
  z-index: 2;
  button{
    border: 1px solid #143727;
    background-color: #143727;
    color: #E5E5E5;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    &:hover{
      background-color: transparent;
    color: #143727;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
  }
`;

export const SettingsContainer = styled.div`
z-index: 2;
  background-color: #FFCF07;
  color: #143727;
  padding: 20px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
    flex-wrap: wrap;
    gap: 10px;
    position: fixed;
  bottom:50px;
  max-width: 300px;
  width: 85%;
    input{
    padding: 5px;
    border-radius: 4px;
    border: none;
    margin-top: 10px;
  }
  .box{
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #143727;
  }
  .delete{
    display: flex;
    flex-direction: column;
    gap: 10px;
    .red{
      background-color: red;
      border: 1px solid red;
      &:hover{
      background-color: transparent;
    color: red;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
    }
  }
  button{
    align-self: center;
    background-color: #143727;
    color: #E5E5E5;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  width: fit-content;
  min-width: 100px;
  height: 30px;
  border: 1px solid #143727;
&:hover{
      background-color: transparent;
    color: #143727;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
  }
`;