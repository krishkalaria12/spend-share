'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeedback, createFeedback, deleteFeedback, likeFeedback } from '@/actions/feedback.actions';
import { ListFeedback } from '@/app/feedback/ListFeedback';
import { CreateFeedback } from '@/app/feedback/CreateFeedback'; 
import { Feedback as FeedbackType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/nextjs';
import { ServerError } from '@/components/server-error';

const FeedbackPage = () => {
  const [message, setMessage] = useState('');

  const { userId } = useAuth();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<FeedbackType[], Error>({
    queryKey: ['feedbacks'],
    queryFn: getFeedback,
  });

  const createFeedbackMutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        variant: "success",
        title: "Feedback created successfully",
        description: "Thank you for your feedback!",
      });
      setMessage("");
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "Please Try Again Later!!",
      });
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        variant: 'success',
        title: 'Feedback deleted successfully',
        description: 'Your feedback has been deleted.',
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "Please Try Again Later!!",
      });
    },
  });

  const likeFeedbackMutation = useMutation({
    mutationFn: likeFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        variant: 'success',
        title: 'Feedback liked successfully',
        description: 'Thank you for liking the feedback!',
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "Please Try Again Later!!",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createFeedbackMutation.mutate(message);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const toggleLike = (id: string) => {
    likeFeedbackMutation.mutate(id);
  };

  const toggleDelete = (id: string) => {
    deleteFeedbackMutation.mutate(id);
  };

  if (isError) {
    return (
      <ServerError />
    )
  }

  return (
    <div className="grid py-6 items-start gap-4 px-4 lg:items-center lg:px-0">
      <CreateFeedback
        handleSubmit={handleSubmit}
        onChange={handleInputChange}
        value={message}
        isSubmitting={createFeedbackMutation.isPending}
        isLoading={isLoading}
      />
      <ListFeedback toggleDelete={toggleDelete} clerkId={userId} isLoading={isLoading} data={data || []} toggleLike={toggleLike} />
    </div>
  );
};

export default FeedbackPage;
