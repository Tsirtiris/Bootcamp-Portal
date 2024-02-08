import { styled } from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: #143727;
  color: #E5E5E5;
  width: 100%;
  min-width: 600px;
  overflow-x: auto;
  height: 100%;
  position: absolute;
  right: 0;
  padding: 0;
  @media (max-width: 600px) {
    min-width: auto;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  position: absolute;
  right: 0;
  margin: 20px;
  gap: 20px;
  
  button{
    background-color: #E5E5E5;
    color: #143727;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #E5E5E5;
&:hover{
      background-color: transparent;
    color: #E5E5E5;
    transition: 0.4s color;
    transition: 0.4s background-color;
}
  }
`;

export const Div = styled.div`
  background-color: #E5E5E5;
  padding: 5px;
  margin-top: 50px;
  color: #143727;
  margin-bottom: 100px;
`;

export const Background = styled.div`
  background-color: rgb(0,0,0,0.6);
  position: fixed;
  z-index: 2;
  width: 100vw;
  height: 100%;
`;

export const PostContainer = styled.div`
  background-color: #8D93D9;
  color: #143727;
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid black;
  border-radius: 10px;
  gap: 10px;
  position: fixed;
  bottom:50px;
  right: "20%";
  z-index: 3;
  form{
    display: flex;
    gap: 20px;
    align-items: center;
  }
  input{
    padding: 5px;
    border-radius: 4px;
    border: none;
    margin: 10px;
    margin-left: -10px;
  }
  button{
    background-color: #143727;
    color: #E5E5E5;
  border: 1px solid gray;
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

export const H1 = styled.h1`
  margin-bottom: -5px;
  margin-top: 50px;
  font-size: 40px;
  @media (max-width: 600px) {
    margin-top: 80px;
  }
`;

export const P = styled.p`
  margin-bottom: 5px;
`;

export const SearchInputContainer = styled.div`
  position: relative;
  width: 30%;

  input {
    width: calc(100% - 2rem);
    padding: 0.5rem 1rem 0.5rem 2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
  }

  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
  }
`;