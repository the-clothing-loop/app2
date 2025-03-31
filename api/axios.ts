import redaxios from "redaxios";

const axios = redaxios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  withCredentials: false,
});

export default axios;
