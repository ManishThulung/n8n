"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/config/api";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    const res = await api.post("/register", { username, password });
  };
  return (
    <div className="h-screen">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 items-center gap-y-4 h-full">
        {/* Left Image */}
        <div className="max-md:order-1 lg:col-span-3 md:h-screen w-full bg-[#000842] md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-8 flex items-center">
          {/* <Image
            src="https://readymadeui.com/signin-image.webp"
            alt="signup-image"
            width={600}
            height={600}
            className="lg:w-2/3 w-full h-auto object-contain mx-auto"
            priority
          /> */}
          <img
            src="https://readymadeui.com/signin-image.webp"
            alt="signup-image"
            width={600}
            height={600}
            className="lg:w-2/3 w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 w-full p-8 max-w-lg mx-auto">
          <form className="space-y-6">
            <div>
              <h1 className="text-slate-900 text-3xl font-bold">
                Create account
              </h1>
              <p className="text-[15px] mt-4 text-slate-600">
                Already have an account?
                <Link
                  href="/login"
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="text-slate-900 text-[15px] font-medium mb-2 block">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                required
                className="w-full bg-slate-100 px-4 py-3.5 rounded-md border focus:border-blue-600 outline-none"
                placeholder="Enter your username"
              />
            </div>

            {/* Email
            <div>
              <label className="text-slate-900 text-[15px] font-medium mb-2 block">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-100 px-4 py-3.5 rounded-md border focus:border-blue-600 outline-none"
                placeholder="Enter email"
              />
            </div> */}

            {/* Password */}
            <div>
              <label className="text-slate-900 text-[15px] font-medium mb-2 block">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="w-full bg-slate-100 px-4 py-3.5 rounded-md border focus:border-blue-600 outline-none"
                placeholder="Create password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
