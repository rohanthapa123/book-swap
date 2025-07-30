import axios from "axios";

export const myAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
  withCredentials: true,
});
