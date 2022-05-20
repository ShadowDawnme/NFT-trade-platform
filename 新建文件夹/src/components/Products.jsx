import { AllInboxSharp } from "@material-ui/icons";
import { useEffect } from "react";
import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
// const getProduct = asycn () => {
//   try {
//     const res = await axios.get("http://localhost:5000/api/product");
//     console.log(res);
//   } catch(err) {}
// };

const Products = () => {

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product");
      } catch(err) {};
    };
    getProduct();
  });

  return (
    <Container>
      {popularProducts.map((item) => (
        <Product item={item} key={item.id} />
      ))}
    </Container>
  );
};

export default Products;
