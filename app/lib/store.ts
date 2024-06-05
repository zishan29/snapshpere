import { configureStore } from "@reduxjs/toolkit";

import postReducer from "./features/posts/postSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      posts: postReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
