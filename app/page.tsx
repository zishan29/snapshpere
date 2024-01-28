"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        let res = await fetch("https://snap-talk.adaptable.app/verifyToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: localStorage.getItem("token") }),
        });
        if (res.status === 401) {
          let resData = await res.json();
          console.log(resData.error);
          router.push("/login");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  });
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <Nav />
      <div className="sm:w-8/12 lg:w-6/12 xl:w-4/12  flex flex-col items-center h-full grow gap-0">
        <HomePage />
      </div>
    </main>
  );
}
