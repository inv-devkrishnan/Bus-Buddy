import { axiosApi } from "./axiosApi";
export async function login(userCredentials) {
  let status;
  let message;
  await axiosApi
    .post("account/local-login/", userCredentials)
    .then((result) => {
      localStorage.setItem("refresh_token", result.data.refresh);
      sessionStorage.setItem("access_token", result.data.access);
      status = true;
    })
    .catch(function (error) {
      status = false;
      message = error;
    });
  return { status: status, message: message };
}

export async function loginWithGoogle(credToken) {
  let status;
  let message;
  await axiosApi
    .post("account/google-login/", credToken)
    .then((result) => {
      localStorage.setItem("refresh_token", result.data.refresh);
      sessionStorage.setItem("access_token", result.data.access);
      status = true;
    })
    .catch(function (error) {
      status = false;
      message = error;
    });
  return { status: status, message: message };
}

export async function getAcessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  let access_token;
  const body = {
    refresh: refreshToken,
  };
  await axiosApi
    .post("account/refresh/", body)
    .then((result) => {
      access_token = result.data.access;
    })
    .catch(function (error) {
      console.log(error);
    });
  return access_token;
}
