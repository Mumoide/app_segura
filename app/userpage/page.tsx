"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  type: string;
  id: string;
}

export default function UserPage() {
  const router = useRouter();
  const [users, setUsers] = useState({
    email: "",
    id: 0,
    type: 1,
    username: "",
  });
  const { data: session, status } = useSession();

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
        setUsers(updatedUsers);
        console.log(updatedUsers);
        console.log("User fetched successfully");
      } else {
        console.log(res);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated") {
    return <div>Access Denied</div>;
  }

  const onSubmit = async (data: any) => {
    if (data.password != data.confirmPassword) {
      return alert("Passwords dont match");
    }
    const res = await fetch("/api/auth/editProfile", {
      method: "PUT",
      body: JSON.stringify({
        id: users.id,
        username: data.username,
        email: session?.user?.email,
        password: data.password,
        type: users.type,
        userEmail: session?.user?.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    const resJSON = await res.json();
    console.log(resJSON);
    if (resJSON.message == "User already exists") {
      alert("User already exists");
      return;
    }

    if (resJSON.message == "Email already exists") {
      alert("Email already exists");
      return;
    }

    if (res.ok) {
      alert("User edited successfully");
      router.refresh();
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div className="w-1/2 bg-slate-900 p-6 rounded-md flex flex-col items-center mt-5">
        <div className="w-1/2 sm:w-full pl-2 pr-2 flex justify-center">
          <h3 className="text-slate-200 font-bold text-3xl mt-3 mb-8">
            Welcome to your User Page, {users?.username}
          </h3>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full sm:w-1/2 pl-2 pr-2"
        >
          <div className="mb-4">
            <label htmlFor="email" className="text-white text-sm mb-1 block">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", {
                required: {
                  value: true,
                  message: "Required field",
                },
                maxLength: {
                  value: 20,
                  message: "Max length is 20 characters",
                },
                minLength: {
                  value: 3,
                  message: "Min length is 3 characters",
                },
                pattern: {
                  value: /^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/,
                  message: "Only letters and numbers allowed",
                },
              })}
              defaultValue={users.username ?? ""}
              className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              className="w-full"
              style={{
                minHeight: "1.5em",
                visibility: errors.username ? "visible" : "hidden",
              }}
            >
              <span className="text-red-500 text-xs">
                {errors.username ? (errors.username.message as string) : " "}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="text-white text-sm mb-1 block">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Required field",
                },
                maxLength: {
                  value: 20,
                  message: "Max length is 20 characters",
                },
                minLength: {
                  value: 5,
                  message: "Min length is 5 characters",
                },
                pattern: {
                  value: /^[^';"<>-]*$/,
                  message: "Invalid character used",
                },
              })}
              className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              className="w-full"
              style={{
                minHeight: "1.5em",
                visibility: errors.password ? "visible" : "hidden",
              }}
            >
              <span className="text-red-500 text-xs">
                {errors.password ? (errors.password.message as string) : " "}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="text-white text-sm mb-1 block"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Required field",
                },
                maxLength: {
                  value: 20,
                  message: "Max length is 20 characters",
                },
                minLength: {
                  value: 5,
                  message: "Min length is 5 characters",
                },
                pattern: {
                  value: /^[^';"<>-]*$/,
                  message: "Invalid character used",
                },
              })}
              className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              className="w-full"
              style={{
                minHeight: "1.5em",
                visibility: errors.confirmPassword ? "visible" : "hidden",
              }}
            >
              <span className="text-red-500 text-xs">
                {errors.confirmPassword
                  ? (errors.confirmPassword.message as string)
                  : " "}
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <input
              value="Save Changes"
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg mt-5"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
