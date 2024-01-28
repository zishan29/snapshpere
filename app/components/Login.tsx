"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        (async () => {
          try {
            let res = await fetch(
              "https://snapsphere-api.adaptable.app/verifyToken",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: localStorage.getItem("token") }),
              }
            );
            if (res.status === 401) {
              let resData = await res.json();
              console.log(resData.error);
              router.push("/login");
            }
            if (res.status === 200) {
              router.push("/");
            }
          } catch (err) {
            console.log(err);
          }
        })();
      }
    }
  }, []);

  async function loginUser(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    let data = {
      username: username,
      password: password,
    };

    try {
      let res = await fetch("https://snapsphere-api.adaptable.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        let resData = await res.json();
        localStorage.setItem("token", resData.token);
        localStorage.setItem("id", resData.userData._id);
        router.push("/");
        setLoading(false);
      }
      if (res.status === 403) {
        const resData = await res.json();
        setErrorMessage(resData.info.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function demoLoginUser(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    setUsername("testuser");
    setPassword("testuser@123");

    let data = {
      username: "testuser",
      password: "testuser@123",
    };

    try {
      let res = await fetch("https://snapsphere-api.adaptable.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        let resData = await res.json();
        localStorage.setItem("token", resData.token);
        localStorage.setItem("id", resData.userData._id);
        router.push("/");
        setLoading(false);
      }
      if (res.status === 403) {
        const resData = await res.json();
        setErrorMessage(resData.info.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="form-container bg-gray-900 w-4/5 sm:w-96">
        <p className="title">Login</p>
        <form className="form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder=""
              className="focus:border-violet-400 bg-gray-900 border border-gray-700"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            ></input>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder=""
              className="focus:border-violet-400 bg-gray-900 border border-gray-700"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
          </div>
          {errorMessage && (
            <div className="text-sm text-[#9ca3af] mt-1">{errorMessage}</div>
          )}
          <button
            className="sign mt-4 bg-violet-400 text-gray-900"
            onClick={(e) => loginUser(e)}
          >
            {loading ? (
              <div className="loader">
                <div className="scanner">
                  <span>Loading...</span>
                </div>
              </div>
            ) : (
              "Sign in"
            )}
          </button>
          <button
            className="sign mt-4 bg-violet-400 text-gray-900"
            onClick={(e) => demoLoginUser(e)}
          >
            Sign in to a demo account
          </button>
        </form>
        <p className="signup mt-4">
          Don&apos;t have an account?
          <Link
            href="/signup"
            className="hover:underline hover:decoration-violet-400"
          >
            {" "}
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
