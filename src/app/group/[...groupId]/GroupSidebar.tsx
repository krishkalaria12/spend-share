import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import GroupMemberActions from "./GroupMemberActions";
import AddMemberToGroup from "./AddMemberToGroup";
import { Group, Friend } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroupById } from "@/actions/group.actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface GroupSidebarProps {
  group: Group;
  error: string;
  groupId: string;
  handleMakeAdminOfGroup: (groupId: string, memberId: string) => void;
  handleRemoveFromGroup: (groupId: string, memberId: string) => void;
  addMembers: Friend[];
}

const GroupSidebar: React.FC<GroupSidebarProps> = ({
  group,
  error,
  handleMakeAdminOfGroup,
  handleRemoveFromGroup,
  addMembers,
  groupId
}) => {

  const {toast} = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteGroupMutation = useMutation({
    mutationFn: () => deleteGroupById(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({
        title: "Successfully deleted group",
        description: "You've successfully deleted this group",
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

  const handleDeleteGroup = () => deleteGroupMutation.mutate();

  return (
    <div className="drawer-side z-50">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <ul className="menu p-4 mt-20 bg-white w-80 min-h-[88%] dark:bg-base-200 text-base-content">
        <li className="cursor-none">
          <div>
            <div>
              <Avatar className="hidden h-16 w-16 sm:flex">
                <AvatarImage src={group.avatar} alt="Avatar" />
                <AvatarFallback>{group.name.replace(/\s/g, "").substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-Roboto">{group.name}</h3>
            </div>
          </div>
          <div className="w-full text-base">
            About: {group.description}
          </div>
        </li>
        <li>
          <div>
            <p className="font-Roboto font-semibold text-base">Members : {group.totalMembers}</p>
          </div>
        </li>
        {group.members.map((member) => (
          <li className="w-full mt-2" key={member._id}>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-2">
                <Avatar className="hidden h-10 w-10 sm:flex">
                  <AvatarImage src={member.avatar} alt="Avatar" />
                  <AvatarFallback>{member.fullName.replace(/\s/g, "").substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex space-x-2 items-center">
                  <h3 className="text-xl max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis font-bold font-Roboto">{member.fullName}</h3>
                  {member.isAdmin && <span className="text-base">(&#34;Admin&#34;)</span>}
                </div>
              </div>
              {group.isAdmin && !member.isAdmin && (
                <div>
                  <GroupMemberActions
                    groupId={group._id}
                    memberId={member._id}
                    handleMakeAdminOfGroup={handleMakeAdminOfGroup}
                    handleRemoveFromGroup={handleRemoveFromGroup}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
        {group.isAdmin && (
          <li className="mt-4 flex-row items-center justify-center flex space-x-2">
            <Button disabled={deleteGroupMutation.isPending} onClick={handleDeleteGroup}>
              {
                deleteGroupMutation.isPending ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 className="animate-spin" size={16} />
                    {"Deleting..."}
                  </div>
                )
                :
                "Delete Group"
              }
            </Button>
            {addMembers.length > 0 && (
              <AddMemberToGroup
                error={error}
                groupId={groupId}
                addMembers={addMembers}
              />
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default GroupSidebar;
