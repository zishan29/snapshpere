"use client";

import Image from "next/image";
import { useState } from "react";
import { MouseEvent } from "react";

interface following {
  username: string;
  profilePicture: string;
  _id: string;
}

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

export default function Friends({
  following,
  addFollowing,
  searchUsers,
  searchResults,
  removeFollowing,
}: {
  following: following[] | null;
  addFollowing: (e: MouseEvent<HTMLButtonElement>, v: string) => void;
  searchUsers: (e: MouseEvent<HTMLButtonElement>, v: string) => void;
  searchResults: User[] | null;
  removeFollowing: (e: MouseEvent<HTMLButtonElement>, v: string) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  return (
    <>
      <div className="flex flex-col items-center text-white">
        <div className="flex gap-2 items-center w-full">
          <input
            type="text"
            placeholder="Search people to follow"
            className="px-2 my-4 rounded-md py-1 outline-none text-gray-900 grow"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <button
            className="bg-violet-400 text-white font-semibold hover:bg-violet-300 active:bg-violet-500 px-3 py-1 rounded-md outline-none focus:outline-violet-400"
            onClick={(e) => {
              searchUsers(e, searchInput);
              setSearchInput("");
            }}
          >
            Search
          </button>
        </div>
        {searchResults !== null && searchResults.length > 0 ? (
          <div className="bg-gray-100 p-4 text-gray-900 flex flex-col gap-2 rounded-md w-full">
            {searchResults?.map((user) => (
              <div key={user._id} className="flex items-center gap-2 h-10">
                <Image
                  src={user.profilePicture}
                  alt={""}
                  width={100}
                  height={100}
                  className="rounded-full h-full w-auto"
                />
                <div>{user.username}</div>
                <button
                  className="bg-violet-400 ml-auto text-white font-semibold hover:bg-violet-300 active:bg-violet-500 px-3 py-1 rounded-md outline-none focus:outline-violet-400"
                  onClick={(e) => addFollowing(e, user._id)}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="font-semibold text-2xl my-4">Following</div>
        {following?.length === 0 ? (
          <div className="mt-4">You are not following anyone</div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {following?.map((user) => (
              <div key={user._id} className="flex items-center gap-2 h-10">
                <Image
                  src={user.profilePicture}
                  alt={""}
                  width={100}
                  height={100}
                  className="rounded-full h-full w-auto"
                />

                <div>{user.username}</div>
                <button
                  className="bg-violet-400 ml-auto text-white font-semibold hover:bg-violet-300 active:bg-violet-500 px-3 py-1 rounded-md outline-none focus:outline-violet-400"
                  onClick={(e) => removeFollowing(e, user._id)}
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
