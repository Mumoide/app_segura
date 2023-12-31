"use client";
import React, { useState, useEffect } from "react";
import { Table } from "../../../components/otra";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "../../../components/Table.css";

interface TableRow {
  username: string;
  email: string;
  type: number;
}

interface TableProps {
  rows: TableRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
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

  const getUsers = async () => {
    try {
      const res = await fetch("/api/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      await getUsers();
    };

    fetchUsers();

    getUsers();
  }, [status === "authenticated"]);

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
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row: TableRow, idx: number) => {
                // const statusText =
                // row.status.charAt(0).toUpperCase() + row.status.slice(1);

                return (
                  <tr key={idx}>
                    <td>{row.username}</td>
                    <td className="expand">{row.email}</td>
                    <td>
                      <span>{row.type !== 1 ? "Admin" : "User"}</span>
                    </td>
                    <td className="fit">
                      <span className="actions">
                        <BsFillTrashFill
                          className="delete-btn"
                          onClick={() => deleteRow(idx)}
                        />
                        <BsFillPencilFill
                          className="edit-btn"
                          onClick={() => editRow(idx)}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
