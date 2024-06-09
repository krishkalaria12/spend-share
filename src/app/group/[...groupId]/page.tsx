// src/app/group/[...groupId]/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
  getGroupById,
  getGroupTransactions,
  removeMemberFromGroupByAdmin,
  changeGroupAdmin,
} from "@/actions/group.actions";
import TransactionList from "@/app/group/[...groupId]/TransactionList";
import GroupDetails from "@/app/group/[...groupId]/GroupDetails";
import { Group, Transaction } from "@/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ServerError } from "@/components/server-error";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const GroupId: React.FC = () => {
  const pathname = usePathname();
  const groupId = pathname.split("/")[2];

  const {toast} = useToast();
  const queryClient = useQueryClient();

  const {userId} = useAuth();
  
  const [error, setError] = useState("");

  const { data: groupDetails, isLoading: loadingGroupDetails, isError: errorGroupDetails } = useQuery<Group>({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
  });

  const { data: groupTransactions, isLoading: loadingGroupTransactions, isError: errorGroupTransactions } = useQuery<Transaction[]>({
    queryKey: ["groupTransactions", groupId],
    queryFn: () => getGroupTransactions(groupId),
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, memberId }: { groupId: string; memberId: string }) => removeMemberFromGroupByAdmin(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast({
        title: "Successfully removed member from group",
        description: "You've successfully removed a member from this group",
        variant: "success",
        duration: 5000,
      })
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again Later!!",
        variant: "destructive",
        duration: 5000,
      })
    }
  });

  const changeAdminMutation = useMutation({
    mutationFn: ({ groupId, memberId }: { groupId: string; memberId: string }) => changeGroupAdmin(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast({
        title: "Successfully made admin",
        description: "You've successfully made this member an admin of this group",
        variant: "success",
        duration: 5000,
      })
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again Later!!",
        variant: "destructive",
        duration: 5000,
      })
    }
  });
  
  const handleRemoveFromGroup = (memberId: string) => removeMemberMutation.mutate({ groupId, memberId });
  const handleMakeAdminOfGroup = (memberId: string) => changeAdminMutation.mutate({ groupId, memberId });

  if (loadingGroupDetails || loadingGroupTransactions) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (errorGroupDetails || errorGroupTransactions) {
    return <ServerError />;
  }

  console.log(groupDetails?.friends);
  

  return (
    <>
      <GroupDetails
        error={error}
        groupId={groupId}
        addMembers={groupDetails?.friends || []}
        handleRemoveFromGroup={handleRemoveFromGroup}
        handleMakeAdminOfGroup={handleMakeAdminOfGroup}
        group={groupDetails as Group}
      />
      <TransactionList
        error={error}
        groupId={groupId}
        currentUserId={userId}
        transactions={groupTransactions || []}
      />
    </>
  );
};

export default GroupId;
