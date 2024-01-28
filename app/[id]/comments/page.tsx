"use client";

import { useParams } from "next/navigation";
import Nav from "@/app/components/Nav";
import Comments from "@/app/components/Comments";

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
  const { id } = useParams();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
        <Nav />
        <div className="sm:w-8/12 lg:w-6/12 xl:w-4/12 flex flex-col items-center h-full grow gap-0">
          <Comments id={id} />
        </div>
      </main>
    </>
  );
}
