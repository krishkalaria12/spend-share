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
    <div className="flex border h-[6rem] px-2 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted items-center gap-4">
      <Avatar className="hidden h-16 w-16 sm:flex">
        <AvatarImage src={group.avatar || "https://res.cloudinary.com/krishbackend/image/upload/v1712999375/kpvg81dod9pzjaxabbpe.png"} alt="Avatar" />
        <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-lg font-medium leading-none">{group.name} {`(${group.members.length})`}</p>
        <p className="text-base text-muted-foreground">{group.description}</p>
      </div>
      <div className="ml-auto font-medium">
        <Link href={`/group/${group._id}`}>
          <Button>
            Visit
          </Button>
        </Link>
      </div>
    </div>
  );
}
