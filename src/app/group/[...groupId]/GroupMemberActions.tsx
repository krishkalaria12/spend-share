// src/components/group/GroupMemberActions.tsx
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

interface GroupMemberActionsProps {
  groupId: string;
  memberId: string;
  handleMakeAdminOfGroup: (groupId: string, memberId: string) => void;
  handleRemoveFromGroup: (groupId: string, memberId: string) => void;
}

const GroupMemberActions: React.FC<GroupMemberActionsProps> = ({ groupId, memberId, handleMakeAdminOfGroup, handleRemoveFromGroup }) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleMakeAdminOfGroup(memberId, groupId)} className="cursor-pointer">
            Make Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRemoveFromGroup(memberId, groupId)} className="cursor-pointer">
            Remove
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupMemberActions;
