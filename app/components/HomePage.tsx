"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { Post } from "../types";
import {
  initializePosts,
  likes,
  updatePosts,
} from "../lib/features/posts/postSlice";

export default function HomePage() {
  const [image, setImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const posts = useAppSelector((state) => state.posts.posts);
  const [text, setText] = useState("");
  const router = useRouter();
  const [userLiked, setUserLiked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = localStorage.getItem("id");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setImage(selectedFile);

    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setImagePreview(previewURL);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    dispatch(initializePosts());
  }, []);

  async function uploadPost() {
    const formData = new FormData();
    if (text !== "") {
      formData.append("text", text);
    }
    if (image !== null) {
      formData.append("image", image);
    }
    dispatch(updatePosts(formData));
    setText("");
    setImage(null);
    setImagePreview(null);
  }

  useEffect(() => {
    const initialUserLikedState = posts.map((post) =>
      post.likes.includes(userId as string)
    );
    setUserLiked(initialUserLikedState);
  }, [posts]);

  function handleCommentClick(post: Post) {
    router.push(`${post.id}/comments`);
  }

  async function likeThisPost(postId: string, index: number) {
    try {
      dispatch(likes(postId, userId as string));
      setUserLiked((prevUserLiked) => {
        const updatedUserLiked = [...prevUserLiked];
        updatedUserLiked[index] = !updatedUserLiked[index];
        return updatedUserLiked;
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="w-11/12 py-4 px-6 border border-gray-700 flex flex-col gap-3 h-max">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Image Preview"
            className="h-full w-auto object-cover rounded-md"
          />
        )}
        <input
          type="text"
          className="bg-inherit border-b border-gray-700 p-1 px-1 outline-none"
          placeholder="What is happening?!"
          onChange={(e) => setText(e.target.value)}
          value={text}
          required
        />
        <div className="flex items-center">
          <button
            onClick={() => inputRef.current?.click()}
            type="button"
            className="h-max w-max outline-none focus:outline-violet-400 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-violet-400"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </button>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: "none" }}
          />
          <button
            className="bg-violet-400 hover:bg-violet-300 active:bg-violet-500 px-3 py-1 rounded-md ml-auto outline-none focus:outline-violet-400 text-white font-semibold"
            onClick={uploadPost}
          >
            Post
          </button>
        </div>
      </div>
      {loading ? (
        <div className="loader mt-10">
          <div className="scanner-white">
            <span>Loading...</span>
          </div>
        </div>
      ) : (
        <div className=" w-11/12 h-max mb-10 flex flex-col">
          {posts.length > 0 &&
            posts.map((post, index) => (
              <div
                key={post.id}
                className="px-6 py-4 flex flex-col gap-3 border-x border-b border-x-gray-700 border-b-gray-700"
              >
                <div className="flex gap-2 items-center h-8">
                  {post.userId.profilePicture ? (
                    <img
                      src={post.userId.profilePicture}
                      alt={""}
                      className="h-full w-auto rounded-full"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-full w-auto"
                    >
                      <path d="M18 20a6 6 0 0 0-12 0" />
                      <circle cx="12" cy="10" r="4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                  {post.userId.username}
                </div>
                {post.imageUrl && (
                  <img
                    alt={""}
                    src={post.imageUrl}
                    loading="lazy"
                    className="h-full w-auto rounded-md"
                  />
                )}
                {post.text && <div className="break-words">{post.text}</div>}
                <div className="flex gap-3">
                  <div
                    className="flex gap-1 items-center"
                    onClick={() => likeThisPost(post.id, index)}
                  >
                    {userLiked[index] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-heart stroke-rose-700 fill-rose-700 cursor-pointer"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-heart cursor-pointer"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    )}
                    <div>{post.likes.length}</div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle cursor-pointer"
                      onClick={() => handleCommentClick(post)}
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                    <div>{post.comments.length}</div>
                  </div>
                </div>
              </div>
            ))}
          <div className="ml-auto mr-auto mt-10">No more posts</div>
        </div>
      )}
    </>
  );
}
