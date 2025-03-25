import axios from "axios";

const syncapi = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:6006/api" : "/api",
    withCredentials: true, // Important for sending/receiving cookies
});

export default syncapi;