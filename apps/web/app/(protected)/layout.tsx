"use client";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const isAuth = getCookie("isAuth");
  if (!isAuth) {
    router.push("/login");
  }
  return <>{children}</>;
}
