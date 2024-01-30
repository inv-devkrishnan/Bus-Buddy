import { axiosApi, openAxiosApi } from "./axiosApi";
export async function login(userCredentials) {
  let status;
  let message;
  await axiosApi
    .post("account/local-login/", userCredentials)
    .then((result) => {
      message = result.data;
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
      message = result.data;
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
export async function deleteUserAccount() {
  let status;
  let message;
  await axiosApi
    .put("account/delete-account/")
    .then((result) => {
      message = result.data;
      status = true;
    })
    .catch(function (error) {
      status = false;
      message = error;
    });
  return { status: status, message: message };
}

export async function changePassword(passwordData) {
  let status;
  let message;
  await axiosApi
    .put("account/change-password/", passwordData)
    .then((result) => {
      message = result.data;
      status = true;
    })
    .catch(function (error) {
      status = false;
      message = error;
    });
  return { status: status, message: message };
}

export async function forgotPasswordSendEmail(emailData) {
  let status;
  let message;
  await openAxiosApi
    .post("account/forgot-password-send-mail/", emailData)
    .then((result) => {
      message = result.data;
      status = true;
    })
    .catch(function (error) {
      status = false;
      message = error;
    });
  return { status: status, message: message };
}
