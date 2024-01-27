import Link from "next/link";

export default function Nav() {
  return (
    <>
      <nav className="w-screen h-20 bg-gray-900 text-white flex gap-6 items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-1 ml-auto hover:bg-gray-950 px-5 py-3 rounded-md active:bg-gray-950 focus:bg-gray-950"
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
            className="lucide lucide-home"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <div>Home</div>
        </Link>
        <Link
          href="/friends"
          className="flex items-center gap-1 hover:bg-gray-950 px-5 py-3 rounded-md active:bg-gray-950 focus:bg-gray-950"
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
            className="lucide lucide-users-round"
          >
            <path d="M18 21a8 8 0 0 0-16 0" />
            <circle cx="10" cy="8" r="5" />
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
          </svg>
          <div>Following</div>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-1 hover:bg-gray-950 px-5 py-3 rounded-md active:bg-gray-950 focus:bg-gray-950"
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
            className="lucide lucide-circle-user-round"
          >
            <path d="M18 20a6 6 0 0 0-12 0" />
            <circle cx="12" cy="10" r="4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <div>Profile</div>
        </Link>
        <Link
          href=""
          className="flex items-center gap-1 mr-auto hover:bg-gray-950 px-5 py-3 rounded-md active:bg-gray-950 focus:bg-gray-950"
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
            className="lucide lucide-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <div>Log out</div>
        </Link>
      </nav>
    </>
  );
}
