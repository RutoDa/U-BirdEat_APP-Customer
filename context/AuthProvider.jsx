import { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../global/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("access", userData.access);
      await AsyncStorage.setItem("refresh", userData.refresh);
      const profile_info = await axiosInstance.get("customer/profile/");
      setUser(profile_info.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Error storing auth data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access");
      await AsyncStorage.removeItem("refresh");
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error removing auth data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
