"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function App({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    id: 0,
    type: 1,
    username: "",
  });
  useEffect(() => {
    console.log(params.id);
  });

  const onSubmit = async (data: any) => {
    if (data.password != data.confirmPassword) {
      return alert("Passwords dont match");
    }

    const res = await fetch("/api/auth/editUser", {
      method: "PUT",
      body: JSON.stringify({
        id: params.id,
        username: data.username,
        email: data.email,
        password: data.password,
        type: data.type,
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
      router.push("/adm/userslist");
    }
  };

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

  const onClickBackButton = () => {
    router.push("/adm/userslist");
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
    <div className="h-3/4 mt-3 flex justify-center items-center">
      <div className="w-1/2 bg-slate-900 p-6 rounded-md flex flex-col items-center mt-5">
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Edit user</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full sm:flex-row mb-2">
            <div className="w-full sm:w-1/2 pl-2 pr-2">
              <label htmlFor="username" className="text-white text-sm mb-1">
                Username
              </label>
              <input
                type="text"
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
                    message: "Only letters allowed",
                  },
                })}
                className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Juan Perez"
              />
              <div
                className="w-full sm:w-1/2"
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

            <div className="w-full sm:w-1/2 pl-2 pr-2">
              <label htmlFor="password" className="text-white text-sm mb-1">
                Password
              </label>
              <input
                type="password"
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
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^'^";<>-]*$/,
                    message:
                      "Se requiere una mayúscula, una minúscula y un caracter especial. (Se excluyen los caracteres: ^';\"<>-)",
                  },
                })}
                className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="*********"
              />
              <span
                className="text-red-500 text-xs mt-2"
                style={{ minHeight: "1.5em" }}
              >
                {errors.password ? (errors.password.message as string) : " "}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full sm:flex-row mb-2">
            <div className="w-full sm:w-1/2 pl-2 pr-2">
              <label htmlFor="email" className="text-white text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Required field",
                  },
                  maxLength: {
                    value: 50,
                    message: "Max length is 50 characters",
                  },
                  minLength: {
                    value: 3,
                    message: "Min length is 3 characters",
                  },
                  pattern: {
                    value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="user@mail.com"
              />
              <div
                className="w-full sm:w-1/2"
                style={{
                  minHeight: "1.5em",
                  visibility: errors.email ? "visible" : "hidden",
                }}
              >
                <span className="text-red-500 text-xs">
                  {errors.email ? (errors.email.message as string) : " "}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-1/2 pl-2 pr-2">
              <label
                htmlFor="confirmPassword"
                className="text-white text-sm mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
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
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^'^";<>-]*$/,
                    message:
                      "Se requiere una mayúscula, una minúscula y un caracter especial. (Se excluyen los caracteres: ^';\"<>-)",
                  },
                })}
                className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="*********"
              />
              <span
                className="text-red-500 text-xs mt-2"
                style={{ minHeight: "1.5em" }}
              >
                {errors.confirmPassword
                  ? (errors.confirmPassword.message as string)
                  : " "}
              </span>
            </div>
          </div>

          <div className="w-full sm:flex-row mb-2 pl-2 pr-2">
            <label htmlFor="type" className="text-white text-sm mb-1">
              User type
            </label>
            <select
              id="type"
              {...register("type", {
                required: "User type is required",
                min: { value: 1, message: "Please choose an user type" },
              })}
              className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="0">Choose a type</option>
              <option value="1">User</option>
              <option value="2">Admin</option>
            </select>
            <div
              className="w-full sm:w-1/2"
              style={{
                minHeight: "1.5em",
                visibility: errors.type ? "visible" : "hidden",
              }}
            >
              <span className="text-red-500 text-xs">
                {errors.type ? (errors.type.message as string) : " "}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-evenly">
            <input
              value="Edit"
              type="submit"
              className="w-1/3 bg-blue-600 hover:bg-slate-800 text-white p-3 rounded-lg mt-5"
            />
            <button
              onClick={onClickBackButton}
              className={
                "w-1/3 bg-red-600 hover:bg-slate-800 text-white p-3 rounded-lg mt-5"
              }
            >
              <Link href="/adm/userslist">Back</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
