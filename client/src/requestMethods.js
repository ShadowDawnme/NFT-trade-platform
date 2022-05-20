import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNTU2ZGM4ODhhNDQ2NzQ5YmMxMThhYiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDk4MjQwMTYsImV4cCI6MTY1MDA4MzIxNn0.XKW1q4SEmaiuvYAAS71S7kJqZSKdmktwHk6z6mrl8O8";

export const publicRequest = axios.create({
    baseURL: BASE_URL,
    header: {"Access-Control-Allow-Origin": "*"}
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header: {token: `Bearer ${TOKEN}`, "Access-Control-Allow-Origin": "*"}
});