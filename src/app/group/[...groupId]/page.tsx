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
import NotFound from "@/app/not-found";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const GroupId: React.FC = () => {
  const pathname = usePathname();
  const groupId = pathname.split("/")[2];

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { userId } = useAuth();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: groupDetails, isLoading: loadingGroupDetails, isError: errorGroupDetails } = useQuery<Group>({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
  });

  const { data: groupTransactions, isLoading: loadingGroupTransactions, isError: errorGroupTransactions, isFetching: fetchingGroupTransactions, isPlaceholderData } = useQuery<{
    transactions: Transaction[];
    totalPages: number;
    currentPage: number;
  }>({
    queryKey: ["groupTransactions", groupId, page],
    queryFn: () => getGroupTransactions(groupId, page, limit),
    // keepPreviousData: true,
    placeholderData: (previous) => previous,
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

  const isMember = groupDetails?.members.some(member => member.clerkId === userId);
  if (!isMember) {
    return <NotFound />;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (groupTransactions?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <>
      <GroupDetails
        error=""
        groupId={groupId}
        addMembers={groupDetails?.friends || []}
        handleRemoveFromGroup={handleRemoveFromGroup}
        handleMakeAdminOfGroup={handleMakeAdminOfGroup}
        group={groupDetails as Group}
      />
      <TransactionList
        error=""
        groupId={groupId}
        currentUserId={userId}
        transactions={groupTransactions?.transactions || []}
      />
      {groupTransactions?.totalPages && groupTransactions.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {Array.from({ length: groupTransactions.totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={page === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {fetchingGroupTransactions && (
        <Loader2 className="h-12 w-12 animate-spin" />
      )}
    </>
  );
};

export default GroupId;
