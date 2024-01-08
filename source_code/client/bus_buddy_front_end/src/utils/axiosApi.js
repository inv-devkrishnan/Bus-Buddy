import axios from "axios";
import { getAcessToken } from "./apiCalls";

export const axiosApi = axios.create({
  // for api call's which requrires authentication
  baseURL: process.env.REACT_APP_BASEURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const openAxiosApi = axios.create({
  // for open api calls
  baseURL: process.env.REACT_APP_BASEURL,
});
const noAuthUrls = [
  "account/local-login/",
  "account/google-login/", // urls for which auth header not required
  "user/registration/",
  "normal-user/view-seats/",
];
const loginUrl = "/login";
axiosApi.interceptors.request.use(
  function (config) {
    if (noAuthUrls.includes(config.url)) {
      return config;
    } else {
      console.log(config.url);
      config.headers["Authorization"] = `Bearer ${sessionStorage.getItem(
        "access_token"
      )}`;
      return config;
    }
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);
axiosApi.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (
      error.config.url === "account/refresh/" &&
      error.response.status === 401
    ) {
      // if refresh page is getting 401 then refresh token is expired so return to login page
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace(loginUrl);
    } else {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "account/local-login/" &&
        originalRequest.url !== "account/google-login/"
      ) {
        /* tries to get new access token from  exisiting refresh token when access token expires
        and request url is not login api call*/
        originalRequest._retry = true;
        console.log(originalRequest.url);
        const accessToken = await getAcessToken();
        sessionStorage.setItem("access_token", accessToken);
        console.log("Access Token Updated !");
        axiosApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${sessionStorage.getItem("access_token")}`;
        return axiosApi(originalRequest);
      } else if (
        error.response.status === 401 &&
        originalRequest.url !== "account/local-login/" &&
        originalRequest.url !== "account/google-login/"
      ) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace(loginUrl);
      }
    }

    return Promise.reject(error);
  }
);
