import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Group } from '@/types';

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  
  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden shadow-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 items-center gap-4 p-4 sm:p-6">
      <div className="flex-shrink-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={group.avatar || "https://res.cloudinary.com/krishbackend/image/upload/v1712999375/kpvg81dod9pzjaxabbpe.png"} alt="Avatar" />
          <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col sm:flex-grow">
        <p className="text-lg font-semibold leading-tight">{group.name} ({group.members.length})</p>
        <p className="text-base text-gray-600 dark:text-gray-400 mt-1">{group.description}</p>
      </div>
      <div className="flex items-center sm:ml-auto">
        <Link href={`/group/${group._id}`}>
          <Button>
            Visit
          </Button>
        </Link>
      </div>
    </div>
  );
}
