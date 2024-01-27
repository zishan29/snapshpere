"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      }
      if (res.status === 403) {
        const resData = await res.json();
        setErrorMessage(resData.info.message);
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
            ></input>
          </div>
          {errorMessage && (
            <div className="text-sm text-[#9ca3af] mt-1">{errorMessage}</div>
          )}
          <button
            className="sign mt-4 bg-violet-400 text-gray-900"
            onClick={(e) => loginUser(e)}
          >
            Sign in
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
