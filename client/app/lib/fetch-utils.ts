// step 28 - create a file called fetch-utils.ts in the lib folder and add the following code to it. This file will contain utility functions for making API requests using axios. We will also set up an axios instance with interceptors to handle authentication tokens and response errors.
// also install axios before step 28 - npm install axios | and also create .env file
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api-v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // bearer token format
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  },
);

const postData = async<T>(path: string, data: unknown): Promise<T> => {
  const response = await api.post(path, data);
  return response.data;
};

const fetchData = async<T>(path: string): Promise<T> => {
  const response = await api.get(path);
  return response.data;
};

const updateData = async<T>(path: string, data: unknown): Promise<T> => {
  const response = await api.put(path, data);
  return response.data;
};

const deleteData = async<T>(path: string): Promise<T> => {
  const response = await api.delete(path);
  return response.data;
};

export { postData, fetchData, updateData, deleteData };