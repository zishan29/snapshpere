"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Friends from "../components/Friends";
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

interface following {
  username: string;
  profilePicture: string;
  _id: string;
}

export default function Page() {
  const [following, setFollowing] = useState<following[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [searchResults, setSearchResult] = useState<User[] | null>(null);
  const [message, setMessage] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  let id: string | null;
  if (typeof window !== "undefined") {
    id = localStorage.getItem("id");
  }

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const bearer = `Bearer ${token}`;
      try {
        let res = await fetch("https://snapsphere-api.adaptable.app/users", {
          method: "GET",
          headers: {
            Authorization: bearer,
          },
        });
        if (res.ok) {
          let resData = await res.json();
          console.log(resData);
          setUsers(resData.users);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  async function updateFollowing() {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    setLoading(true);

    try {
      let res = await fetch("https://snapsphere-api.adaptable.app/user", {
        method: "GET",
        headers: {
          Authorization: bearer,
        },
      });
      if (res.ok) {
        let resData = await res.json();
        setFollowing(resData.user.following);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function addFollowing(
    e: MouseEvent<HTMLButtonElement>,
    userId: string
  ) {
    e.preventDefault();
    if (id === "65b3417da2429ca4c8635731") {
      showMessage("Test user cannot perform this action");
      return;
    }
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    const data = {
      following: userId,
    };
    try {
      let res = await fetch(
        "https://snapsphere-api.adaptable.app/user/addFollowing",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        updateFollowing();
        setSearchResult(null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function removeFollowing(
    e: MouseEvent<HTMLButtonElement>,
    userId: string
  ) {
    e.preventDefault();
    if (id === "65b3417da2429ca4c8635731") {
      showMessage("Test user cannot perform this action");
      return;
    }
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;
    const data = {
      unfollowing: userId,
    };
    try {
      let res = await fetch(
        "https://snapsphere-api.adaptable.app/user/removeFollowing",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        console.log("Successfully removed following");
        updateFollowing();
      } else {
        console.error("Failed to remove following:", res.status);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function searchUsers(e: MouseEvent<HTMLButtonElement>, username: string) {
    e.preventDefault();
    if (username.length === 0) return;
    const searchTerm = username.toLowerCase();

    const searchResults = users!.filter(
      (user) =>
        user.username.toLowerCase().startsWith(searchTerm) &&
        !following!.some(
          (followedUser) =>
            followedUser.username.toLowerCase() === user.username.toLowerCase()
        )
    );

    setSearchResult(searchResults);
  }

  useEffect(() => {
    updateFollowing();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <>
      <main className="bg-gray-900 flex min-h-screen flex-col items-center">
        {message && (
          <div className="fixed left-1/2 top-20 z-10 -translate-x-1/2 transform rounded bg-violet-400 px-4 py-2 text-white font-semibold">
            {message}
          </div>
        )}
        <Nav />
        <div className="sm:w-8/12 lg:w-6/12 xl:w-4/12">
          <Friends
            following={following}
            addFollowing={addFollowing}
            searchUsers={searchUsers}
            searchResults={searchResults}
            removeFollowing={removeFollowing}
            loading={loading}
          />
        </div>
      </main>
    </>
  );
}
