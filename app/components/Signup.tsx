"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

interface Errors {
  username?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  email?: string | null;
}

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});

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

  async function signup(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let data = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    try {
      let res = await fetch("https://snapsphere-api.adaptable.app/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        let resData = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("token", resData.token);
          localStorage.setItem("id", resData.user._id);
        }
        router.push("/");
      }
      if (res.status === 400) {
        let resData = await res.json();
        setErrors(resData.errors);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className="form-container bg-gray-900 w-4/5 sm:w-96">
        <p className="title">Sign up</p>
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
            {errors.username && (
              <div className="text-sm text-[#9ca3af] mt-1">
                {errors.username}
              </div>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder=""
              className="focus:border-violet-400 bg-gray-900 border border-gray-700"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            {errors.email && (
              <div className="text-sm text-[#9ca3af] mt-1">{errors.email}</div>
            )}
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
            {errors.password && (
              <div className="text-sm text-[#9ca3af] mt-1">
                {errors.password}
              </div>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder=""
              className="focus:border-violet-400 bg-gray-900 border border-gray-700"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            {errors.confirmPassword && (
              <div className="text-sm text-[#9ca3af] mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <button
            className="sign mt-4 bg-violet-400 text-gray-900 hover:bg-violet-300 active:bg-violet-600"
            onClick={(e) => signup(e)}
          >
            Sign up
          </button>
        </form>
        <p className="signup mt-4">
          Already have an account?
          <Link
            href="/login"
            className="hover:underline hover:decoration-violet-400"
          >
            {" "}
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
