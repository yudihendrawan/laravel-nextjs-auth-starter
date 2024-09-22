import axios from "axios";
import useSWR from "swr";
import { useUserStore } from "@/libs/userStore";

// Fetcher untuk request dengan token
const fetcherWithToken = (url: string, token: string | null) =>
  axios
    .get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => res.data);

// Fetcher tanpa token
const fetcherWithoutToken = (url: string) =>
  axios.get(url).then((res) => res.data);

// Hook untuk fetch data
const useFetchData = (url: string, useToken: boolean = false) => {
  const { token } = useUserStore(); // Mengambil token dari Zustand

  const fetcher = useToken
    ? () => fetcherWithToken(url, token) // Jika butuh token
    : () => fetcherWithoutToken(url); // Jika tidak butuh token

  // SWR digunakan untuk fetch data
  const { data, error, isValidating } = useSWR(url, fetcher);

  return {
    data,
    error,
    loading: isValidating,
  };
};

export { useFetchData };
