import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bizly-webapp-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Keep this! This is crucial for sending/receiving cookies.
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // *** REMOVE OR COMMENT OUT THIS SECTION FOR SESSION-BASED AUTH ***
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // If you have other token-based routes (e.g., to a different microservice
    // that uses JWTs), you'd create a *separate* axios instance for those,
    // or conditionally add the header based on the URL.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized. Redirect to login.");
      // Example: window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;