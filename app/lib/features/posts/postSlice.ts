import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, UpdateLikesPayload, PostState } from "@/app/types";
import postServices from "@/app/services/postService";
import type { AppDispatch } from "../../store";

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    appendPost(state, action: PayloadAction<Post>) {
      state.posts.push(action.payload);
    },
    setPosts(state, action) {
      return action.payload;
    },
    updateLikes(state, action: PayloadAction<UpdateLikesPayload>) {
      const { id, userId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === id);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const index = post.likes.indexOf(userId);
        if (index >= 0) {
          post.likes.splice(index, 1);
        } else {
          post.likes.push(userId);
        }
      }
    },
  },
});

export const { appendPost, setPosts, updateLikes } = postSlice.actions;

export const initializePosts = () => {
  return async (dispatch: AppDispatch) => {
    const posts = await postServices.getAll();
    dispatch(setPosts(posts));
  };
};

export const likes = (id: string, userId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(updateLikes({ id, userId }));
    await postServices.updateLikes(id);
  };
};

export const updatePosts = (formData: FormData) => {
  return async (dispatch: AppDispatch) => {
    const data = await postServices.uploadPost(formData);
    dispatch(appendPost(data.post));
  };
};

export const initializePostsByUser = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const posts = await postServices.getPostByUser(userId);
    dispatch(setPosts(posts));
  };
};

export default postSlice.reducer;
