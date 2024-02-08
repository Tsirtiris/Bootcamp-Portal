import { styled } from "styled-components";

export const Job = styled.div`
  display: flex;
  .noUnderline:hover{
    text-decoration: none;
    cursor: default;
  }
  .link{
    color: white;
  }
  div{
    color: #143727;
    cursor: pointer;
    padding: 5px;
    border-top: 1px solid #dadada;
    width: 12vw;
    min-width: 100px;
    max-width: 130px;
    margin: 0 10px;
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
  .text{
    cursor: default;
    text-decoration: none;
    color: #143727;
    &:hover{
      color: #143727;
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
    &:hover{
      color: blue;
    }
  }
`;

export const JobFields = styled.div`
  background-color: #FFCF07;
  display: flex;
  div{
    padding: 5px;
    margin: 0 10px;
    width: 12vw;
    max-width: 130px;
    min-width: 100px;
    font-weight: bold;
  }
  
`;

export const PostContainer = styled.div`
z-index: 2;
  background-color: #8D93D9;
  color: #143727;
  padding: 20px;
  border: 1px solid black;
  border-radius: 10px;
  form{  
    display: flex;
    align-items: end;
    justify-content: space-around;
    div{
      display: flex;
      flex-direction: column;
      width: 40%;
    }
    flex-wrap: wrap;
    gap: 10px;
    input{
    padding: 5px;
    border-radius: 4px;
    border: none;
  }
  textarea{
    padding: 5px;
    border-radius: 4px;
    border: none;
    width: 23.3vw;
    height: 5%;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
  }
  }
  position: fixed;
  bottom:50px;
  width: 60%;
  label{
    font-weight: bold;
  }
  
  button{
    background-color: #143727;
    color: #E5E5E5;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  width: 80px;
  height: 30px;
  border: 1px solid #143727;
&:hover{
      background-color: transparent;
    color: #143727;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
  }
  .close{
    background-color: transparent;
    padding: 0;
    border: none;
    position: absolute;
    left: 95%;
    font-size: 30px;
    color: #143727;
    rotate: 45deg;
    width: fit-content;
    &:hover{
      opacity: 0.7;
    }
  }
`;

export const DeleteContainer = styled.div`
z-index: 2;
  background-color: #8D93D9;
  color: #143727;
  padding: 20px;
  border: 1px solid black;
  border-radius: 10px;
  position: fixed;
  bottom:50px;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  div{
      display: flex;
  justify-content: center;
  gap: 20px;
  }
  button{
    background-color: #143727;
    color: #E5E5E5;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  width: 80px;
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