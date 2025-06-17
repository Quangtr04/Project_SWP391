import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.2:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;
