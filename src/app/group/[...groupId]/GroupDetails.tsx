// src/components/group/GroupDetails.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GroupSidebar from './GroupSidebar';
import { Group, Friend } from '@/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveGroup } from "@/actions/group.actions";
import { useRouter } from "next/navigation";
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface GroupDetailsProps {
  error: string;
  group: Group;
  groupId: string;
  addMembers: Friend[];
  handleRemoveFromGroup: (memberId: string) => void;
  handleMakeAdminOfGroup: (memberId: string) => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
  error,
  group,
  addMembers,
  handleRemoveFromGroup,
  handleMakeAdminOfGroup,
  groupId
}) => {

  const {toast} = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const leaveGroupMutation = useMutation({
    mutationFn: () => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({
        title: "Successfully left group",
        description: "You've successfully left this group",
        variant: "success",
        duration: 5000,
      })
      router.push("/group");
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

  const handleLeaveGroup = () => leaveGroupMutation.mutate();
  
  return (  
    <div className='p-4 bg-gray-100 dark:bg-[#020817]'>
      <h3 className='text-2xl font-bold mb-4'>Group Details</h3>
      <div className='flex justify-between items-center p-4 border rounded-lg dark:border-gray-600 border-gray-200 dark:bg-gray-800 bg-white dark:text-white text-gray-800 mb-4 shadow-lg'>
        <div className='flex items-center space-x-2'>
          <Avatar className="hidden h-16 w-16 sm:flex">
            <AvatarImage src={group.avatar} alt="Avatar" />
            <AvatarFallback>{group.name.replace(/\s/g, '').substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className='flex items-center space-x-2'>
              <div className="drawer max-w-max">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer" className="drawer-button">
                    <Badge className={"text-lg cursor-pointer"}>
                      {group.name}
                    </Badge>
                  </label>
                </div>
                <GroupSidebar
                  error={error}
                  addMembers={addMembers}
                  groupId={groupId}
                  handleMakeAdminOfGroup={handleMakeAdminOfGroup}
                  handleRemoveFromGroup={handleRemoveFromGroup}
                  group={group}
                />
              </div>
              <p>({group.totalMembers})</p>
            </div>
            <div className="max-w-[310px] overflow-hidden whitespace-nowrap overflow-ellipsis">
              {group.description}
            </div>
          </div>
        </div>
        <Button disabled={leaveGroupMutation.isPending} onClick={handleLeaveGroup}>
          {
            leaveGroupMutation.isPending ? (
              <div className="flex items-center space-x-2 font-semibold text-gray-500">
                <Loader2 className="animate-spin" size={16} />
                {"Leaving..."}
              </div>
            )
            :
            "Leave"
          }
        </Button>
      </div>
    </div>
  );
};

export default GroupDetails;
