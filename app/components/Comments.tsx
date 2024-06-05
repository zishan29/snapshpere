"use client";

import { MouseEvent } from "react";
import { useState, useEffect } from "react";
import { Post } from "../types";

export default function Comments({ id }: { id: string | string[] }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [userLiked, setUserLiked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = localStorage.getItem("id");
  }

  async function getUserProfile() {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    try {
      let res = await fetch(`https://snapsphere-api.adaptable.app/user`, {
        method: "GET",
        headers: {
          Authorization: bearer,
        },
      });
      if (res.ok) {
        let resData = await res.json();
        console.log(resData);
        setUserProfile(resData.user.profilePicture);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function updatePost() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    try {
      let res = await fetch(`https://snapsphere-api.adaptable.app/post/${id}`, {
        method: "GET",
        headers: {
          Authorization: bearer,
        },
      });
      if (res.ok) {
        let resData = await res.json();
        setPost(resData.posts);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updatePost();
    getUserProfile();
  }, []);

  async function postComment(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    try {
      let res = await fetch(
        `https://snapsphere-api.adaptable.app/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
          body: JSON.stringify({ comment: comment }),
        }
      );
      if (res.ok) {
        updatePost();
        setComment("");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (post) {
      const initialUserLikedState = post.comments.map((comment) =>
        comment.likes.includes(userId as string)
      );
      setUserLiked(initialUserLikedState);
    }
  }, [post]);

  async function likeThisComment(commentId: string, commentIndex: number) {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    try {
      let res = await fetch(
        `https://snapsphere-api.adaptable.app/comments/${commentId}/likes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
        }
      );
      if (res.ok) {
        let resData = await res.json();
        setPost((prevPost) => {
          if (!prevPost) {
            return null;
          }

          const updatedPost: Post = {
            ...prevPost,
            comments: prevPost.comments.map((comment, index) => {
              if (index === commentIndex) {
                return {
                  ...comment,
                  likes: resData.likes,
                };
              }
              return comment;
            }),
          };

          return updatedPost;
        });

        setUserLiked((prevUserLiked) => {
          const updatedUserLiked = [...prevUserLiked];
          updatedUserLiked[commentIndex] = !updatedUserLiked[commentIndex];
          return updatedUserLiked;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {post && (
        <>
          {loading ? (
            <div className="loader mt-10">
              <div className="scanner-white">
                <span>Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-11/12 px-6 py-4 flex flex-col gap-3 border border-gray-700 text-white bg-gray-900">
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
                    className="h-full w-auto rounded-md"
                  />
                )}
                {post.text && <div>{post.text}</div>}
              </div>
              <div className="w-11/12 flex border-x border-b border-x-gray-700 border-b-gray-700 px-2 md:px-6 md:py-4 gap-3 items-center h-16">
                {userProfile !== "" ? (
                  <img
                    src={userProfile}
                    alt={""}
                    className="h-full w-auto rounded-full hidden md:block"
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
                    className="h-full w-auto hidden md:block"
                  >
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
                <input
                  type="text"
                  placeholder="Post your reply"
                  className="bg-inherit grow px-1 border-none border-b border-b-gray-700 outline-none"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                <button
                  className="mr-auto bg-violet-400 text-gray-900 hover:bg-violet-300 active:bg-violet-500 px-3 py-1 rounded-md outline-none focus:outline-violet-400"
                  onClick={postComment}
                >
                  Post
                </button>
              </div>
              <div className="w-11/12">
                {post &&
                  post.comments.length > 0 &&
                  post.comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="flex flex-col w-full gap-3 border-x border-b border-x-gray-700 border-b-gray-700 px-6 py-4"
                    >
                      <div className="flex gap-2 items-center h-8">
                        {comment.userId.profilePicture !== "" ? (
                          <img
                            src={comment.userId.profilePicture}
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

                        <div>{comment.userId.username}</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="grow">{comment.comment}</div>
                        <div
                          className="flex gap-1 items-center"
                          onClick={() => likeThisComment(comment.id, index)}
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
                          <div>{comment.likes.length}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="ml-auto mr-auto py-3">No comments</div>
            </>
          )}
        </>
      )}
    </>
  );
}
