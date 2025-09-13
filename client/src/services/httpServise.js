import axios from "axios";
import apiConfig from "./../../config.json";

axios.defaults.baseURL = apiConfig.apiUrl;

export const httpsServise = {
  get: axios.get,
  post: axios.post,
};
