"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllGroups } from "@/actions/group.actions";
import { GroupCard } from "@/app/group/GroupCard";
import { Link } from "next-view-transitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Group } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ServerError } from "@/components/server-error";

const GroupPage: React.FC = () => {
  const { data: groups, isLoading: loadingGroups, isError } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: getAllGroups,
  });

  if (loadingGroups) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <ServerError />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className={`flex items-center ${groups && groups.length > 0 ? "justify-between" : "justify-end"}`}>
          {groups && groups.length > 0 && <h1 className="text-2xl font-bold tracking-wide sm:text-3xl md:text-4xl">Your Groups</h1>}
          <Link href="/group/create">
            <Button>Create Group</Button>
          </Link>
        </div>
        <div className="">
          {groups && groups.length > 0 &&
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>View Your Groups</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-8 md:grid-cols-2 lg:grid-cols-2 py-2 px-4">
                {groups.map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))}
              </CardContent>
            </Card>
          }
          {groups && groups.length === 0 && (
            <>
              <p className="text-center col-span-2 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              You don&#39;t have any groups yet.
              <span className="block font-light text-gray-400 text-2xl mt-2 tracking-wide">
                Create one now and start managing money together!
              </span>
              </p>
              <Image 
                src={"/group.webp"}
                alt="Group-not-found"
                width={300}
                height={300}
                className="object-cover col-span-2 mx-auto"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupPage;
