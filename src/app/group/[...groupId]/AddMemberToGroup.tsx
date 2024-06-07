// src/components/group/AddMemberToGroup.tsx
import React, { useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Friend } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addMemberToGroup } from '@/actions/group.actions';
import { Loader2 } from 'lucide-react';

interface AddMemberToGroupProps {
  error: string;
  groupId: string;
  addMembers: Friend[];
}

const AddMemberToGroup: React.FC<AddMemberToGroupProps> = ({ error,groupId, addMembers }) => {

  const {toast} = useToast();
  const queryClient = useQueryClient();

  const options = addMembers.map((friend) => ({
    value: friend._id,
    label: friend.username,
  }));

  const [selectedMembers, setSelectedMembers] = useState<MultiValue<{ value: string; label: string }>>([]);

  const onSubmit = () => {
    handleAddMember(selectedMembers.map(member => member.value));
  };

  const addMemberMutation = useMutation({
    mutationFn: (memberIds: string[]) => addMemberToGroup(groupId, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast({
        title: "Successfully added members to group",
        description: "You've successfully added members to this group",
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

  const handleAddMember = (members: string[]) => addMemberMutation.mutate(members);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Add Members</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select
            options={options}
            isMulti
            value={selectedMembers}
            onChange={setSelectedMembers}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Add Members</Button>
          <DialogClose asChild>
            <Button disabled={addMemberMutation.isPending} type="button" variant="outline">
              {
                addMemberMutation.isPending ? (
                  <div className="flex items-center space-x-2 text-lg font-semibold text-gray-500">
                    <Loader2 className="animate-spin" size={16} />
                    {"Loading"}
                  </div>
                ) : (
                  "Close"
                )
              }
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberToGroup;
