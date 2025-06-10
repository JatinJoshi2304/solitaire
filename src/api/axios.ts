import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

export const request = async <T>(
  url: string,
  method: "get" | "post" | "put" | "delete" = "get",
  data?: any
): Promise<T> => {
  try {
    const finalUrl: string = `${apiURL}/${url}`;
    const res = await axios({ url: finalUrl, method, data });
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Request failed";
    console.error("Request error:", message);
    throw new Error(message);
  }
};
