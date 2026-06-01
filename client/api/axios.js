import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend.onrender.com/api",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;