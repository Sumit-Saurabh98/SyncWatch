import axios from "axios";

const syncapi = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:6006/api/v1" : "/api",
    withCredentials: true, // Important for sending/receiving cookies
});

export default syncapi;