interface BaseUser {
  username: string;
  profilePicture?: string;
  id: string;
}

export interface User extends BaseUser {
  email: string;
  followers: string[] | [];
  following: string[] | [];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  userId: BaseUser;
  comment: string;
  likes: string[];
  postId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface Post {
  id: string;
  text?: string;
  imageUrl?: string;
  comments: Comment[];
  likes: string[];
  userId: User;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLikesPayload {
  id: string;
  userId: string;
}

export interface PostState {
  posts: Post[];
}

export interface LikesResponse {
  post: Post;
}

export interface UploadResponse {
  message: string;
  post: Post;
}

export interface UserResponse {
  user: User;
}

export interface PostResponse extends PostState {}

export interface SinglePostResponse {
  post: Post;
}
