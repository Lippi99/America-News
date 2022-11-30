import axios from "axios";

export const api = axios.create({
  baseURL: "https://america-news.vercel.app",
});
