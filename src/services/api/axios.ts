import axios from "axios";

interface axiosSetup {
  url: string;
  timeOut: number;
}

const setupAxios: axiosSetup = {
  url: "/",
  timeOut: 10000,
};

export const http = axios.create({
  baseURL: setupAxios.url,
  timeout: setupAxios.timeOut,
  headers: {
    "Content-Type": "application/json",
  },
});
