import { Add, Remove } from "@material-ui/icons";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import MessageBox from "../components/MessageBox";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../requestMethods";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection:"column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;


const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover{
      background-color: #f8f4f4;
  }
`;

const Product = () => {
  
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [creater, setProduct2] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get("/product/" + id);
        setProduct(res.data);
        const res2 = await publicRequest.get("/user/name/" + res.data.creater);
        setProduct2(res2.data);
      } catch(err) {}
    };
    getProduct();
  }, [id]);

  const handleClick = (e) => {
    console.log("clicked");
    const buyProduct = async () => {
        try {
          const res = await publicRequest.get("api/product/deal/" + id);
          if (res.data[0] != "E") alert("buy successfully");
          else alert("buy failed");
        } catch(err) {
          alert("buy failed");
        }
    };
    buyProduct();
  }

  // const blob = new Blob(product.img, { type: "jpg" });
  // const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <ImgContainer>
          <Image src={product.image} />
        </ImgContainer>
        <InfoContainer>
          <Title>{product.title}</Title>
          <Desc>Creater: {creater.username}</Desc>
          <Desc>{product.desc}</Desc>
          <Price>$ {product.price}</Price>
          <AddContainer>
            <Button onClick={handleClick}>BUY NOW</Button>
          </AddContainer>
        </InfoContainer>
      </Wrapper>
      <MessageBox />
      <Footer />
    </Container>
  );
};

export default Product;
