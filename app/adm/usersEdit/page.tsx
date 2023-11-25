"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="h-3/4 mt-3 flex justify-center items-center">
      <div className="w-1/2 bg-slate-900 p-6 rounded-md flex flex-col items-center mt-5">
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Need ID</h1>
      </div>
    </div>
  );
}
