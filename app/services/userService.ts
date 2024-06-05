import axios from "axios";
import { UserResponse } from "../types";

const BASEURL = "https://snapsphere-api.adaptable.app/user";

let bearer = "";
let token: string | null = "";
if (typeof window !== "undefined") {
  token = window.localStorage.getItem("token");
  bearer = `Bearer ${token}`;
}

const getUser = async () => {
  const { data } = await axios.get<UserResponse>(`${BASEURL}`, {
    headers: { Authorization: bearer },
  });
  return data;
};

const services = { getUser };
export default services;
