import axios from "axios";
const BASEURL = "https://snapsphere-api.adaptable.app/posts";
import { Post, LikesResponse, UploadResponse, PostResponse } from "../types";

let bearer = "";
let token: string | null = "";
if (typeof window !== "undefined") {
  token = window.localStorage.getItem("token");
  bearer = `Bearer ${token}`;
}

const getAll = async () => {
  const { data } = await axios.get<Post[]>(`${BASEURL}`, {
    headers: { Authorization: bearer },
  });
  return data;
};

const updateLikes = async (id: string) => {
  try {
    const { data } = await axios.put<LikesResponse>(
      `${BASEURL}/${id}/likes`,
      null,
      {
        headers: { Authorization: bearer },
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating likes:", error);
    throw error;
  }
};

const uploadPost = async (formData: FormData) => {
  const { data } = await axios.post<UploadResponse>(`${BASEURL}`, formData, {
    headers: { Authorization: bearer },
  });
  return data;
};

const getPostByUser = async (userId: string) => {
  const { data } = await axios.get<PostResponse>(`${BASEURL}/${userId}`, {
    headers: { Authorization: bearer },
  });
  return data;
};

const services = { getAll, updateLikes, uploadPost, getPostByUser };

export default services;
