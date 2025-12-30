"use client";

import { api } from "@/config/api";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    const res = await api.post("/login", { username, password });
    if (res.data.data.token && res.data.success) {
      setCookie("isAuth", true);
      router.push("/workflows");
    }
  };
  return (
    <div className="h-screen">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 items-center gap-y-4 h-full">
        {/* Left Image */}
        <div className="max-md:order-1 lg:col-span-3 md:h-screen w-full bg-[#000842] md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-8 flex items-center">
          {/* <Image
            src="https://readymadeui.com/signin-image.webp"
            alt="login-image"
            width={600}
            height={600}
            className="lg:w-2/3 w-full h-auto object-contain mx-auto"
            priority
          />
          
          */}

          <img
            src="https://readymadeui.com/signin-image.webp"
            alt="login-image"
            width={600}
            height={600}
            className="lg:w-2/3 w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 w-full p-8 max-w-lg mx-auto">
          <form className="space-y-6">
            <div>
              <h1 className="text-slate-900 text-3xl font-bold">Sign in</h1>
              <p className="text-[15px] mt-4 text-slate-600">
                Don&apos;t have an account?
                <Link
                  href="/register"
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Register here
                </Link>
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-900 text-[15px] font-medium mb-2 block">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                type="username"
                required
                className="w-full text-sm text-slate-900 bg-slate-100 focus:bg-transparent px-4 py-3.5 rounded-md border border-gray-200 focus:border-blue-600 outline-none"
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-900 text-[15px] font-medium mb-2 block">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                required
                className="w-full text-sm text-slate-900 bg-slate-100 focus:bg-transparent px-4 py-3.5 rounded-md border border-gray-200 focus:border-blue-600 outline-none"
                placeholder="Enter password"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              className="w-full py-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium"
              onClick={handleSubmit}
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <hr className="flex-1 border-slate-300" />
              <span className="text-sm text-slate-500">or</span>
              <hr className="flex-1 border-slate-300" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full py-2.5 border rounded-md bg-slate-50 hover:bg-slate-100 font-medium"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
