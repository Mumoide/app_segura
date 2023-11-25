"use client";
import React, { useState, useEffect } from "react";
import { Table } from "../../../components/otra";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface TableRow {
  // Define the properties of each row here
}

interface User {
  username: string;
  email: string;
  type: number;
  id: string;
}

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([] as User[]);
  const [user, setUser] = useState({
    email: "",
    id: 0,
    type: 1,
    username: "",
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/getUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUsers();
  }, []);

  const getUser = async () => {
    try {
      const res = await fetch("/api/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      if (res.ok) {
        const updatedUsers = await res.json();
        setUser(updatedUsers);
        console.log("User fetched successfully");
      } else {
        console.error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
    };

    fetchUser();
  }, [status === "authenticated"]);

  const deleteRow = async (idx: number) => {
    try {
      const res = await fetch("/api/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: users[idx].id,
          userEmail: session?.user?.email,
        }),
      });
      if (res.ok) {
        // Remove the deleted user from the users array
        const updatedUsers = [...users];
        updatedUsers.splice(idx, 1);
        setUsers(updatedUsers);
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editRow = (idx: number) => {
    router.push("/adm/usersEdit/" + users[idx].id);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated") {
    return <div>Access Denied</div>;
  }

  if (user?.type != 2) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <div className="text-center mb-4 bg-slate-800 p-4 mt-3 mx-auto max-w-xl">
        <h1 className="text-slate-200 font-bold text-4xl">Users list</h1>
      </div>
      <div className={"h-3/4 mt-3 flex justify-center items-center"}>
        <Table rows={users} deleteRow={deleteRow} editRow={editRow} />
      </div>
      <div className={"flex justify-center items-center mt-5"}>
        <button
          className={
            "bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded"
          }
        >
          <Link href="/adm/usersform">Create user</Link>
        </button>
      </div>
    </div>
  );
}

export default Page;
