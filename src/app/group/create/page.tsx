"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select, { MultiValue } from "react-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/utils/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { Friend } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createGroupByValues } from "@/actions/group.actions";
import { getAllFriends } from "@/actions/friend.actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ServerError } from "@/components/server-error";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  members: z.array(z.object({ value: z.string(), label: z.string() })).nonempty({ message: "Select at least one member." }),
  image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateGroupPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageUploadUrl, setImageUploadUrl] = useState<string | null>(null);

  const { data: friendsData, isLoading: loadingFriends, isError } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const data = await getAllFriends();
      return data.friends;
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroupByValues,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({
        title: "Group created successfully",
        description: "You've successfully created a new group",
        variant: "success",
        duration: 5000,
      })
      router.push("/group");
    },
    onError: (error: any) => {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: "Please Try Again Later!!",
        variant: 'destructive',
        duration: 5000,
      })
    }
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
      image: "",
    },
  });

  const options = friendsData?.map((friend) => ({
    value: friend._id,
    label: friend.username,
  })) || [];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    const friends: string[] = [];
    data.members.forEach((member) => {
      friends.push(member.value);
    });
    formData.append("friends", friends.join(","));
    if (imageUploadUrl) {
      formData.append("avatar", imageUploadUrl);
    }
    createGroupMutation.mutate(formData);
  };

  if (loadingFriends) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !friendsData) {
    return <ServerError />;
  }

  return (
    <div className="p-4 pl-6">
      <h1 className="text-3xl mb-4 font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Create your Group Now!
      </h1>
      <p className="text-gray-500 mb-4 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        Team up with your friends to tackle finances together! Create a group,
        manage money collectively, and achieve financial goals side by side.
        Join forces for a stronger financial future!
      </p>

      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Group</CardTitle>
          <CardDescription className="text-balance leading-relaxed">
            Gather your friends and embark on a collective financial journey like never before! Create a group and join forces to manage money together efficiently. Pool your resources, share insights, and support each other&#39;s financial goals within the group. With collaborative effort and mutual support, you can maximize your financial strength and achieve greater financial stability. Start your group today and pave the way towards financial success together!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <Select
                      value={field.value as MultiValue<{ value: string; label: string }>}
                      options={options}
                      isMulti
                      className="text-black"
                      onChange={(selectedOptions) => field.onChange(selectedOptions as MultiValue<{ value: string; label: string }>)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex space-x-4 items-center">
                    <FormLabel>Group Image</FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" size="sm">
                          Upload Cover
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <UploadDropzone
                          className="p-8"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            setImageUploadUrl(res?.[0]?.url);
                            toast({
                              title: "Upload Successful",
                              description: "Group image uploaded successfully",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              title: "Error Uploading Image",
                              description: error?.message || "Something went wrong",
                              variant: "destructive",
                            });
                          }}
                        />
                        <DialogClose asChild>
                          <div className="flex justify-end">
                            <Button type="button" variant="outline">Close</Button>
                          </div>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={createGroupMutation.isPending} type="submit">
                {createGroupMutation.isPending ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 className="animate-spin" size={16} />
                    {"Creating..."}
                  </div>
                ) : (
                  "Create Group"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGroupPage;