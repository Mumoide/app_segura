"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "dotenv/config";

export default function Login() {
  const llave = process.env.NEXT_PUBLIC_CRYPTO;
  const [error, setError] = useState("");
  const [waiting, setWaiting] = useState(false);

  function encrypt(text: string, key: string) {
    return text
      .split("")
      .map((x, i) =>
        (x.codePointAt(0)! ^ key.charCodeAt(i % key.length) % 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("");
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { submitCount, errors },
  } = useForm();

  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
    if (!data.password) {
      setError("Password is required");
      return;
    }

    const encryptedPassword = encrypt(data.password, llave as string);
    console.log(encryptedPassword);
    const res = await signIn("credentials", {
      email: data.email,
      password: encryptedPassword,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(
        "/userpage"
        //+
        //  new URLSearchParams({
        //    email: data.email,
        //  })
      );
    }
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (submitCount > 3) {
      setWaiting(true);
      timeout = setTimeout(() => {
        setWaiting(false);
        setError("");
        reset();
      }, 3000); // 1 minute in milliseconds
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [submitCount, setValue, reset]);

  useEffect(() => {
    if (waiting) {
      setError("Too many attempts. Please wait 1 minute before trying again.");
    }
  }, [waiting]);

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="w-1/2 bg-slate-900 p-6 rounded-md mt-5"
      >
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded">
            {error == "No user found" ? "User not found" : error}
          </p>
        )}
        <div className="w-full sm:full pl-2 pr-2">
          <label htmlFor="email" className="text-white text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
            className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="juan@mail.com"
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
        <div className="w-full sm:full pl-2 pr-2">
          <label htmlFor="password" className="text-white text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            className="h-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="*******"
          />
          <div
            className="w-full sm:w-1/2"
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
        {submitCount > 3 ? (
          <>
            <button
              disabled
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
            >
              Login
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
}
