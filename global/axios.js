import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";


const baseURL = "http://10.0.2.88:8787/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      Alert.alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      console.log("Server/Network ERROR");
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      console.log("401 ERROR 1");
      router.replace("/");
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = await AsyncStorage.getItem("refresh");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        // console.log(tokenParts.exp);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/token/refresh/", { refresh: refreshToken })
            .then(async (response) => {
              await AsyncStorage.setItem("access", response.data.access);
              await AsyncStorage.setItem("refresh", response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + response.data.access;
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
              console.log("Refresh ERROR");
              Alert.alert("系統發生錯誤，請重新整理或重新登入。");
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          Alert.alert("系統發生錯誤，請重新整理或重新登入。");
          router.replace("/");
        }
      } else {
        console.log("Refresh token not available.");
        Alert.alert("系統發生錯誤，請重新整理或重新登入。");
        router.replace("/");
      }
    }

    // specific error handling done elsewhere
    console.log("Other ERROR");
    return Promise.reject(error);
  }
);

export default axiosInstance;
