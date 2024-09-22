import { User } from "@/types/User";
import { parseCookies } from "nookies";
import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  token: string | null;
  userData: User;
  login: (token: string, userData: any) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  token: null,
  userData: {
    uuid: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    goggleId: "",
    isActive: false,
  },

  login: (token: string, userData: any) => {
    localStorage.setItem("userData", JSON.stringify(userData));

    set({
      isLoggedIn: true,
      token: token,
      userData: userData,
    });
  },

  logout: () => {
    localStorage.removeItem("userData");

    set({
      isLoggedIn: false,
      token: null,
      userData: {
        uuid: "",
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        goggleId: "",
        isActive: false,
      },
    });
  },

  hydrate: () => {
    const cookies = parseCookies();
    const token = cookies.token;

    if (token) {
      const storedUserData = localStorage.getItem("userData");
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

      set({
        isLoggedIn: true,
        token: token,
        userData: parsedUserData || {
          uuid: "",
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          goggleId: "",
          isActive: false,
        },
      });
    }
  },
}));
