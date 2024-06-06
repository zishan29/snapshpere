import axios from "axios";
const BASEURL = "https://snapsphere-api.adaptable.app";
import {
  Post,
  LikesResponse,
  UploadResponse,
  PostResponse,
  SinglePostResponse,
} from "../types";

let bearer = "";
let token: string | null = "";
if (typeof window !== "undefined") {
  token = window.localStorage.getItem("token");
  bearer = `Bearer ${token}`;
}

const getAll = async () => {
  const { data } = await axios.get<Post[]>(`${BASEURL}/posts`, {
    headers: { Authorization: bearer },
  });
  return data;
};

const updateLikes = async (id: string) => {
  try {
    const { data } = await axios.put<LikesResponse>(
      `${BASEURL}/posts/${id}/likes`,
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
  const { data } = await axios.post<UploadResponse>(
    `${BASEURL}/posts`,
    formData,
    {
      headers: { Authorization: bearer },
    }
  );
  return data;
};

const getPostByUser = async (userId: string) => {
  const { data } = await axios.get<PostResponse>(`${BASEURL}/posts/${userId}`, {
    headers: { Authorization: bearer },
  });
  return data;
};

const getSinglePost = async (id: string) => {
  const { data } = await axios.get<SinglePostResponse>(
    `${BASEURL}/post/${id}`,
    { headers: { Authorization: bearer } }
  );
  return data;
};

const services = {
  getAll,
  updateLikes,
  uploadPost,
  getPostByUser,
  getSinglePost,
};

export default services;
