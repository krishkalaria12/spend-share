import React, { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Friend } from '@/types';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';

type FriendCardProps = {
  friend: Friend & { friendshipId?: string };
  method: (id: string) => void;
  remove?: boolean;
  yourRequestStatus?: boolean;
};

export const FriendCard: FC<FriendCardProps> = ({ friend, method, remove = false, yourRequestStatus = false }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleRemove = () => {
    method(friend.friendshipId ?? friend._id);
    setDialogOpen(false);
  };

  const avatarUrl = friend.avatar || "https://res.cloudinary.com/krishbackend/image/upload/v1712999375/kpvg81dod9pzjaxabbpe.png";
  const buttonText = yourRequestStatus ? 'Cancel Request' : 'Remove';
  const dialogTitle = yourRequestStatus ? 'Cancel Friend Request' : 'Remove Friend';
  const dialogDescription = `Are you sure you want to ${yourRequestStatus ? 'cancel this friend request' : 'remove this friend'}? This action cannot be undone.`;

  return (
    <div className="flex flex-col sm:flex-row max-w-3xl w-full mx-auto mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex-shrink-0">
        <Image
          className="rounded-t-lg sm:rounded-none w-full h-36 object-cover"
          src={avatarUrl}
          alt={friend.username}
          width={300}
          height={150}
        />
      </div>
      <div className="flex sm:flex-row w-full items-center flex-col justify-between p-4 sm:p-6">
        <div>
          <h2 className="text-xl font-semibold">{friend.username}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{friend.email}</p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{friend.fullName}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex justify-end">
          {!remove && (
            <Button onClick={() => method(friend._id)}>
              Add
            </Button>
          )}
          {remove && (
            <>
              {isDesktop ? (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      {buttonText}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{dialogTitle}</DialogTitle>
                      <DialogDescription>
                        {dialogDescription}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={handleRemove}>
                        {buttonText}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="destructive">
                      {buttonText}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>{dialogTitle}</DrawerTitle>
                      <DrawerDescription>
                        {dialogDescription}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 w-full">
                      <Button className="w-full" variant="destructive" onClick={handleRemove}>
                        {buttonText}
                      </Button>
                    </div>
                    <DrawerFooter className="pt-2">
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
