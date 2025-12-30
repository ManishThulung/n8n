"use client";

import { api } from "@/config/api";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getWorkflows() {
      setLoading(true);
      try {
        const res = await api.get("/workflow");
        if (res.data.data && res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getWorkflows();
  }, []);
  if (loading) {
    return <>Loading.........</>;
  }
  return (
    <div className="m-6">
      <div className="flex justify-between items-center">
        <h1>Your workflows</h1>
        <Link href={"/workflows/create"}>
          <Button>Create</Button>
        </Link>
      </div>
      {data && (data as any)?.map((item: any) => <div>{item._id}</div>)}
    </div>
  );
};

export default Page;
