import styled from "styled-components";
import { mobile } from "../responsive";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import rs from "jsrsasign";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://cdn.pixabay.com/photo/2021/12/06/10/20/non-fungible-token-6849846_960_720.jpg")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const pukEncrypt = (PUB_KEY, text) => {
  var pub = rs.KEYUTIL.getKey(PUB_KEY);
  return rs.KJUR.crypto.Cipher.encrypt(text, pub);
}

const Register = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [password2, setPassword2] = useState();

  const handleClick = (e) => {
    e.preventDefault();
    const login = async () => {
        try {
          if (username == undefined || password == undefined || email == undefined) return;
          if (password !== password2) {alert("Password not the same"); return;}
          if (password.length < 8) {alert("Password is too weak"); return;}
          const puk = await publicRequest.get("/auth/pk");  // get public key from server
          const key = puk.data;
          const encryptUsername = pukEncrypt(key, username);  // encrypt acct and pwd
          const encryptPassword = pukEncrypt(key, password);
          const encryptEmail = pukEncrypt(key, email);
          const res = await publicRequest.get("/auth/register?" + "acct=" + encryptUsername + 
          "&pwd=" + encryptPassword + "&email=" + encryptEmail);
          if (res.data[0] == "E") {registerFail(); return;};
          console.log(res.data);
          alert("account creat successfully");
        } catch(err) {
          registerFail();
        }
    };

    const registerFail = () => {
      alert("Account already exists");
    };

    login();
  }

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input placeholder="username" 
           onChange = {(e) => {setUsername(e.target.value);}}
           />
          <Input placeholder="email" 
           onChange = {(e) => {setEmail(e.target.value);}}
           />
          <Input placeholder="password" 
           onChange = {(e) => {setPassword(e.target.value);}}
           type="password"
           />
          <Input placeholder="confirm password" 
           onChange = {(e) => {setPassword2(e.target.value);}}
           type="password"
           />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button onClick = {handleClick}>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;