import axios from "axios";
import { jwtManager } from "../helper/jwtManager";

// Add a request interceptor
export default function configAxios() {
  axios.defaults.baseURL = process.env.REACT_APP_API || 'http://localhost:5000/api/';
  axios.interceptors.request.use(
    (config) => {
      const token = jwtManager.get();
      if (token) {
        config.headers["authorization"] = token;
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
}
