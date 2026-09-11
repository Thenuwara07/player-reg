import React, { createContext, useContext, useState, useEffect } from "react";
import { FormData, SignUpResponse, SigninData } from "../types/authTypes";
import { User } from "@/types";
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  user: User | null;
  login: (signinData: SigninData) => Promise<SignUpResponse>; // Updated to match your signin function
  logout: () => void;
  // register: (formData: FormData) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Check for stored user session
  //   const storedUser = sessionStorage.getItem("userData");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  //   setIsLoading(false);
  // }, []); // Empty dependency array means this runs once on mount

  //  Check session storage on initial load
  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  const login = async (signinData: SigninData): Promise<SignUpResponse> => {
    setIsLoading(true);
    try {
      const payload = {
        username: signinData.username,
        password: signinData.password,
      };

      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signin failed");
      }
      const data = await response.json();
      if (data.token && data.user) {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("userData", JSON.stringify(data.user));
        // const parsedUser = data.user as User; // Ensure the user is typed correctly
        // setUser(parsedUser);
        // console.log("User logged in:", parsedUser); // Log the user data
        // console.log("User logged in:", user); // Log the user data

        const authenticatedUser = {
          id: data.user.id,
          firstname: data.user.firstName,
          role: data.user.role,
          status: data.user.status,
        };
        setUser(authenticatedUser);
        console.log("User logged in aluth:", authenticatedUser);
      }
      return data;
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  };

  // const register = async (userData: any): Promise<boolean> => {
  //   setIsLoading(true);
  //   try {
  //     // Mock registration
  //     const newUser: User = {
  //       id: Date.now().toString(),
  //       ...userData,
  //       registeredDate: new Date().toISOString().split("T")[0],
  //       expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  //         .toISOString()
  //         .split("T")[0],
  //       status: "pending",
  //       role: "user",
  //     };

  //     // In a real app, this would be sent to the server
  //     console.log("New user registered:", newUser);
  //     return true;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("authToken");
  };

  return (
    // <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// contexts/AuthContext.tsx ------------------------------------------------------------------------------------------
// import {
//   createContext,
//   useContext,
//   ReactNode,
//   useState,
//   useEffect,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { FormData, SignUpResponse, SigninData } from "../types/authTypes";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// interface User {
//   id: string;
//   firstname: string;
//   role: "superadmin" | "admin" | "player";
//   status: "confirmed" | "banned" | "pending";
// }

// interface AuthContextType {
//   user: User | null;
//   login: (signinData: SigninData) => Promise<SignUpResponse>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   const login = async (signinData: SigninData): Promise<SignUpResponse> => {
//     // Mock authentication - replace with your actual API call
//     try {
//       const payload = {
//         username: signinData.username,
//         password: signinData.password,
//       };

//       const response = await fetch(`${API_BASE_URL}/auth/signin`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Signin failed");
//       }
//       const data = await response.json();

//       if (data.token && data.user) {
//         sessionStorage.setItem("authToken", data.token);
//         sessionStorage.setItem("userData", JSON.stringify(data.user));
//         const authenticatedUser = {
//           id: data.user.id,
//           firstname: data.user.firstName,
//           role: data.user.role,
//           status: data.user.status,
//         };
//         setUser(authenticatedUser);
//         console.log("User logged in:", authenticatedUser);
//       }
//       return data;
//     } catch (error) {
//       console.error("Signin error:", error);
//       throw error;
//     }
//   };

//   // if (
//   //   (credentials.username === "superadmin@sports.com" && credentials.password === "password") ||
//   //   (credentials.username === "admin@sports.com" && credentials.password === "password") ||
//   //   (credentials.username === "player@sports.com" && credentials.password === "password")
//   // ) {
//   //   const role = credentials.username.split("@")[0] as User["role"];
//   //   const authenticatedUser = {
//   //     id: "1",
//   //     username: credentials.username,
//   //     role: role,
//   //   };
//   //   setUser(authenticatedUser);
//   //   sessionStorage.setItem("userData", JSON.stringify(authenticatedUser));
//   //   return data;
//   // }
//   // return data;
//   // };

//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem("userData");
//     sessionStorage.removeItem("authToken");
//   };

//   // Check session storage on initial load
//   useEffect(() => {
//     const userData = sessionStorage.getItem("userData");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
