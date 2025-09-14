import axios from "axios";
import apiConfig from "./../../config.json";

// API CONFIG ישמש כבסיס לכתובת עבור כל הבקשות שישלף מתוך  BASE URL
// לדוגמה: במקום לכתוב בכל קריאה http://localhost:5001/api/questionnaire,
// מספיק לכתוב "/api/questionnaire"
axios.defaults.baseURL = apiConfig.apiUrl;

export const httpsService = {
  post: axios.post, // מאפשר שליחת נתונים
};
