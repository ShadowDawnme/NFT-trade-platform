import styled from "styled-components";
import {mobile} from "../responsive";
import { useState } from "react";
import { publicRequest } from "../requestMethods";
import rs from "jsrsasign";
import {
  Redirect
} from "react-router-dom";

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
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

// const Msg = styled.h4`
//   font-size: 18px;
//   font-weight: 200;
//   color: red;
// `;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Link = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

// encrypt with public key
const pukEncrypt = (PUB_KEY, text) => {
  var pub = rs.KEYUTIL.getKey(PUB_KEY);
  return rs.KJUR.crypto.Cipher.encrypt(text, pub);
}

// decrept with private key
const prkDecrypt = (PRI_KEY, text) => {
  var prv = rs.KEYUTIL.getKey(PRI_KEY);
  return rs.KJUR.crypto.Cipher.decrypt(text, prv);
}

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  // const dispatch = useDispatch();

  var loginState = false;
  var puk, jwt;

  const handleClick = (e) => {
    e.preventDefault();
    const login = async () => {
        try {
          if (username == undefined || password == undefined) return;

          puk = await publicRequest.get("/auth/pk");
          const key = puk.data;

          console.log("get public key from server: ", key);
          const encryptUsername = pukEncrypt(key, username);  // encrypt acct and pwd
          const encryptPassword = pukEncrypt(key, password);

          // console.log("/auth/login?" + "acct:" + encryptUsername + "&pwd:" + encryptPassword);
          const res = await publicRequest.get("/auth/login?" + "acct=" + encryptUsername + "&pwd=" + encryptPassword);
          if (res.data[0] == "A") {loginFail(); return;};
          // dispatch(loginSuccess(res.data));
          loginState = true;
          jwt = res.data.accessToken;
          alert("login successfully!");
        } catch(err) {
          loginFail();
          // dispatch(loginFailure());
        }
    };

    const loginFail = () => {
      alert("Acoount or password is wrong");
    };

    login();
  }
  return (
    loginState ? <Redirect to="/" /> :
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input placeholder="username" 
          onChange = {(e) => {setUsername(e.target.value);}}
          />
          <Input placeholder="password" 
          type="password"
          onChange = {(e) => {setPassword(e.target.value);}}
          />
          <Button onClick = {handleClick}>LOGIN</Button>
          <Link>FORGOT YOUR PASSWORD ?</Link>
          <Link>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
