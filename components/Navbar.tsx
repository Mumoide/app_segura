import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex justify-between bg-gray-950 text-white px-24 py-3">
      <h1 className="text-xl font-bold">Aplicación segura</h1>
      <ul className="flex gap-x-2">
        {!session?.user ? (
          <li>
            <Link href="/login">Login</Link>
          </li>
        ) : (
          <>
            <li>
              <Link href="/userpage">Profile</Link>
            </li>
            <li>
              <Link href="/adm/userslist">User admin</Link>
            </li>
            <li>
              <Link href="/api/auth/signout">Logout</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
