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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const FeedbackPage = () => {
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { userId } = useAuth();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, isFetching, isPlaceholderData } = useQuery<{
    feedbacks: FeedbackType[],
    totalPages: number,
    currentPage: number,
  }, Error>({
    queryKey: ['feedbacks', page],
    queryFn: () => getFeedback(page, limit),
    placeholderData: (previousData) => previousData,
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

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
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
  console.log(data);
  
  return (
    <div className="grid py-6 items-start gap-4 px-4 lg:items-center lg:px-0">
      <CreateFeedback
        handleSubmit={handleSubmit}
        onChange={handleInputChange}
        value={message}
        isSubmitting={createFeedbackMutation.isPending}
        isLoading={isLoading}
      />
      <ListFeedback 
        toggleDelete={toggleDelete} 
        clerkId={userId} 
        isLoading={isLoading} 
        data={data?.feedbacks || []} 
        toggleLike={toggleLike} 
      />
      {data?.feedbacks && data?.feedbacks.length > 0 && data?.totalPages && data.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem className='cursor-pointer'>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {Array.from({ length: data.totalPages }, (_, index) => (
              <PaginationItem className='cursor-pointer' key={index + 1}>
                <PaginationLink
                  isActive={page === index + 1} 
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {data.totalPages > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem className='cursor-pointer'>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {data?.feedbacks && data?.feedbacks.length > 0 && data?.totalPages && data.totalPages > 1 &&isFetching && <span> Loading...</span>}
    </div>
  );
};

export default FeedbackPage;
