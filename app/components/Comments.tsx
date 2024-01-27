"use client";

import Image from "next/image";
import { MouseEvent } from "react";
import { useState, useEffect } from "react";

interface User {
  _id: string;
  username: string;
  email?: string;
  password?: string;
  followers?: User[];
  following?: User[];
  profilePicture: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Comment {
  _id: string;
  userId: User;
  postId: String;
  likes: string[];
  comment: string;
}

interface Post {
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  text?: string;
  likes: string[];
  userId: User;
  _id: string;
}

export default function Comments({ id }: { id: string | string[] }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [likedComments, setLikedComments] = useState<string[]>([]);

  async function updatePost() {
    try {
      const token = localStorage.getItem("token");
      const bearer = `Bearer ${token}`;
      let res = await fetch(`https://snapsphere-api.adaptable.app/post/${id}`, {
        method: "GET",
        headers: {
          Authorization: bearer,
        },
      });
      let resData = await res.json();
      console.log(resData);
      setPost(resData.posts);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updatePost();
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

  async function likeThisComment(commentId: string) {
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
        await updatePost();
        const updatedLikedComments = likedComments.includes(commentId)
          ? likedComments.filter((id) => id !== commentId)
          : [...likedComments, commentId];
        setLikedComments(updatedLikedComments);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {post && (
        <>
          <div className="w-11/12 px-6 py-4 flex flex-col gap-3 border-x border-b border-x-gray-700 border-b-gray-700 text-white bg-gray-900">
            <div className="flex gap-2 items-center h-8">
              {post.userId.profilePicture ? (
                <Image
                  src={post.userId.profilePicture}
                  height={100}
                  width={100}
                  alt={""}
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
              <Image
                width={1000}
                height={1000}
                alt={""}
                src={post.imageUrl}
                loading="lazy"
                className="h-full w-auto rounded-md"
              />
            )}
            {post.text && <div>{post.text}</div>}
          </div>
          <div className="w-11/12 flex border-x border-b border-x-gray-700 border-b-gray-700 px-6 py-4 gap-3 items-center">
            {post.userId.profilePicture ? (
              <Image
                src={post.userId.profilePicture}
                height={100}
                width={100}
                alt={""}
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
              post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex flex-col w-full gap-3 border-x border-b border-x-gray-700 border-b-gray-700 px-6 py-4"
                >
                  <div className="flex gap-2 items-center">
                    {comment.userId.profilePicture !== "" ? (
                      <Image
                        src={comment.userId.profilePicture}
                        width={100}
                        height={100}
                        alt={""}
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
                        className={`lucide lucide-heart cursor-pointer ${
                          likedComments.includes(comment._id)
                            ? "stroke-rose-700 fill-rose-700"
                            : ""
                        }`}
                        onClick={() => likeThisComment(comment._id)}
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
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
  );
}
