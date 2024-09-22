"use client";
import { useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";

const fetchData = async () => {
  try {
    // Ambil cookies dan token
    const cookies = parseCookies();
    const token = cookies["token"];

    // Pastikan token ada sebelum melakukan request
    if (!token) {
      console.error("No token found");
      return;
    }

    // Lakukan request dengan Bearer token di header Authorization
    const response = await axios.get(
      "http://127.0.0.1:8000/api/admin-dashboard/get-categories",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Menyertakan Bearer token
          Accept: "application/json",
        },
        withCredentials: true, // Ini memastikan cookie dikirim dengan permintaan
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const FetchDataComponent: React.FC = () => {
  useEffect(() => {
    fetchData();
  }, []);

  return <div>Data fetching component</div>;
};

export default FetchDataComponent;
