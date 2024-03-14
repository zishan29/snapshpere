"use client";

import { useEffect, useState, useRef } from "react";
import Nav from "../components/Nav";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

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

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const router = useRouter();
  const [userLiked, setUserLiked] = useState<boolean[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = localStorage.getItem("id");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userId === "65b3417da2429ca4c8635731") {
      showMessage("Test user cannot perform this action");
      return;
    }
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setImage(selectedFile);

    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setImagePreview(previewURL);
    } else {
      setImagePreview(null);
    }
  };

  async function updateUser() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    try {
      let [userRes, postRes] = await Promise.all([
        fetch("https://snapsphere-api.adaptable.app/user", {
          method: "GET",
          headers: {
            Authorization: bearer,
          },
        }),
        fetch(`https://snapsphere-api.adaptable.app/posts/${userId}`, {
          method: "GET",
          headers: {
            Authorization: bearer,
          },
        }),
      ]);
      if (userRes.ok) {
        let userResData = await userRes.json();
        console.log(userResData);
        setUser(userResData.user);
        setEditedUsername(userResData.user.username as string);
        setEditedEmail(userResData.user.email as string);
      }
      if (postRes.ok) {
        let postResData = await postRes.json();
        console.log(postResData);
        setPosts(postResData.posts);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updateUser();
  }, []);

  useEffect(() => {
    const initialUserLikedState = posts.map((post) =>
      post.likes.includes(userId as string)
    );
    setUserLiked(initialUserLikedState);
  }, [posts]);

  function handleCommentClick(post: Post) {
    router.push(`${post._id}/comments`);
  }

  async function likeThisPost(postId: string, index: number) {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    try {
      let res = await fetch(
        `https://snapsphere-api.adaptable.app/posts/${postId}/likes`,
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
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts];

          updatedPosts[index] = {
            ...updatedPosts[index],
            likes: resData.likes,
          };

          return updatedPosts;
        });

        setUserLiked((prevUserLiked) => {
          const updatedUserLiked = [...prevUserLiked];
          updatedUserLiked[index] = !updatedUserLiked[index];
          return updatedUserLiked;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleEditClickEmail = () => {
    setIsEditingEmail(true);
  };

  const handleEditClickUsername = () => {
    setIsEditingUsername(true);
  };

  const handleSaveClickEmail = () => {
    setIsEditingEmail(false);
  };

  const handleSaveClickUsername = () => {
    setIsEditingUsername(false);
  };

  async function updateProfile(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (userId === "65b3417da2429ca4c8635731") {
      showMessage("Test user cannot perform this action");
      return;
    }
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("username", editedUsername as string);
    formData.append("email", editedEmail as string);

    if (image !== null) {
      formData.append("image", image);
    }

    try {
      let res = await fetch("https://snapsphere-api.adaptable.app/user", {
        method: "PUT",
        headers: {
          Authorization: bearer,
        },
        body: formData,
      });
      if (res.ok) {
        await updateUser();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const showMessage = (text: string) => {
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
        {message && (
          <div className="fixed left-1/2 top-20 z-10 -translate-x-1/2 transform rounded bg-violet-400 px-4 py-2 text-white font-semibold">
            {message}
          </div>
        )}
        <Nav />
        {loading ? (
          <div className="loader mt-10">
            <div className="scanner-white">
              <span>Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full md:w-8/12 lg:w-6/12 xl:w-4/12 flex flex-col items-center h-full grow gap-0">
              {user !== null && (
                <>
                  <div className="flex flex-col items-center gap-2 mx-2 md:mx-0 shadow-lg rounded-md p-4">
                    <div className="flex items-center gap-2 w-full">
                      {user.profilePicture !== "" ? (
                        <div className="relative w-3/12">
                          {user.profilePicture &&
                            (imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="profile"
                                width={500}
                                height={500}
                                className="h-auto w-11/12 rounded-full brightness-75"
                              />
                            ) : (
                              <img
                                src={user.profilePicture as string}
                                alt="profile"
                                width={500}
                                height={500}
                                className="h-auto w-11/12 rounded-full brightness-75"
                              />
                            ))}
                          <div className="h-full w-full cursor-pointer">
                            <button
                              onClick={() => inputRef.current?.click()}
                              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
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
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
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
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-3/12">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="profile"
                              width={500}
                              height={500}
                              className="h-auto w-11/12 rounded-full brightness-75"
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
                              className="h-auto w-11/12 rounded-full brightness-75"
                            >
                              <path d="M18 20a6 6 0 0 0-12 0" />
                              <circle cx="12" cy="10" r="4" />
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          )}
                          <div className="h-full w-full cursor-pointer">
                            <button
                              onClick={() => inputRef.current?.click()}
                              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
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
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
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
                          </div>
                        </div>
                      )}
                      <div className="grow">
                        <div>
                          <div className="mt-2 flex w-full items-center text-lg">
                            {isEditingUsername ? (
                              <div className="flex w-full items-center border-b border-gray-700">
                                <input
                                  type="text"
                                  value={editedUsername}
                                  onChange={(e) =>
                                    setEditedUsername(e.target.value)
                                  }
                                  className="grow  bg-transparent py-1 outline-none"
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-6 cursor-pointer fill-gray-200"
                                  onClick={
                                    isEditingUsername
                                      ? handleSaveClickUsername
                                      : handleEditClickUsername
                                  }
                                >
                                  <title>check-bold</title>
                                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                                </svg>
                              </div>
                            ) : (
                              <>
                                <div className="grow">
                                  <div className="py-1 border-b border-b-gray-900">
                                    {user && editedUsername}
                                  </div>
                                </div>
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
                                  onClick={
                                    isEditingUsername
                                      ? handleSaveClickUsername
                                      : handleEditClickUsername
                                  }
                                  className="cursor-pointer"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="mt-2 flex w-full items-center text-lg">
                            {isEditingEmail ? (
                              <div className="flex w-full items-center border-b border-gray-700">
                                <input
                                  type="text"
                                  value={editedEmail}
                                  onChange={(e) =>
                                    setEditedEmail(e.target.value)
                                  }
                                  className="grow  bg-transparent py-1 outline-none"
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-6 cursor-pointer fill-gray-200"
                                  onClick={
                                    isEditingEmail
                                      ? handleSaveClickEmail
                                      : handleEditClickEmail
                                  }
                                >
                                  <title>check-bold</title>
                                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                                </svg>
                              </div>
                            ) : (
                              <>
                                <div className="grow">
                                  <div className="py-1 border-b border-b-gray-900">
                                    {user && editedEmail}
                                  </div>
                                </div>
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
                                  onClick={
                                    isEditingEmail
                                      ? handleSaveClickEmail
                                      : handleEditClickEmail
                                  }
                                  className="cursor-pointer"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-violet-400 hover:bg-violet-300 active:bg-violet-500 px-3 py-1 rounded-md outline-none focus:outline-violet-400 text-white font-semibold"
                      onClick={updateProfile}
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex flex-col items-center w-full px-2 md:px-0">
                    <div className="my-4 font-semibold text-xl">
                      Posts made by you
                    </div>
                    <div className="w-full h-max border-t border-t-gray-700 mb-10">
                      {posts &&
                        posts.length > 0 &&
                        posts.map((post, index) => (
                          <div
                            key={post._id}
                            className="px-6 py-4 flex flex-col gap-3 border-x border-b border-x-gray-700 border-b-gray-700"
                          >
                            <div className="flex gap-2 items-center h-8">
                              {post.userId.profilePicture ? (
                                <img
                                  src={post.userId.profilePicture}
                                  height={100}
                                  width={100}
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
                                width={1000}
                                height={1000}
                                alt={""}
                                src={post.imageUrl}
                                loading="lazy"
                                className="h-full w-auto rounded-md"
                              />
                            )}
                            {post.text && <div>{post.text}</div>}
                            <div className="flex gap-3">
                              <div
                                className="flex gap-1 items-center"
                                onClick={() => likeThisPost(post._id, index)}
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
                    </div>
                    <div className="ml-auto mr-auto my-10">No more posts</div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
