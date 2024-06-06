import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FriendSkeleton = () => {
  return (
    <div className="lg:col-span-2">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className="text-center font-bold text-2xl">Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <FriendCardSkeleton />
          <FriendCardSkeleton />
          <FriendCardSkeleton />
          <FriendCardSkeleton />
          <FriendCardSkeleton />
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendSkeleton;

function FriendCardSkeleton() {
    return (
        <div className="flex max-w-3xl w-full mx-auto mt-4 bg-slate-100 dark:bg-slate-800 items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div>
          <Skeleton className="rounded-full h-20 w-20" />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-4 items-center">
            <p className="font-semibold">Username: </p>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex space-x-4 items-center">
            <p className="font-semibold">Email: </p>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex space-x-4 items-center">
            <p className="font-semibold">Full Name: </p>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
    )
}
