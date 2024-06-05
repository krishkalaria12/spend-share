import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
import { Feedback } from '@/types';
import Image from 'next/image';
import { FeedbackSkeleton } from '@/components/Skeletons/FeedbackSkeleton';
import { Delete, DeleteIcon } from 'lucide-react';

type ListFeedbackProps = {
  data: Feedback[];
  isLoading: boolean;
  clerkId: string | null | undefined; 
  toggleLike: (id: string) => void;
  toggleDelete: (id: string) => void;
};

export const ListFeedback: FC<ListFeedbackProps> = ({ data, isLoading, toggleLike, clerkId, toggleDelete }) => {
  if (isLoading) {
    return (
      <FeedbackSkeleton />
    );
  }

  return (
    <>
      {data && data.length > 0 ? (
        data.map((feedbackItem) => (
          <div
            key={feedbackItem._id}
            className="grid max-w-3xl w-full grid-cols-1 items-center mx-auto gap-4 border-t pt-8"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex col-span-2 sm:col-span-1 items-start gap-4">
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="48"
                  src={`${feedbackItem.owner.avatar}`}
                  style={{ aspectRatio: "48/48", objectFit: "cover" }}
                  width="48"
                />
                <div className="space-y-1 col-span-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-xl">
                      {feedbackItem.owner.username}
                    </h3>
                    <h4 className="text-sm">
                      {formatDate(feedbackItem.createdAt)}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feedbackItem.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => toggleLike(feedbackItem._id)}
                  className="justify-self-end"
                  size="icon"
                  variant="outline"
                >
                  {!feedbackItem.isLiked ? (
                    <ThumbsUpIcon className="w-4 h-4" />
                  ) : (
                    <ThumbsUpFilledIcon className="w-4 h-4" />
                  )}
                  <span className="sr-only">Like</span>
                </Button>
                {clerkId == feedbackItem.owner.clerkId ? (
                  <Button
                  onClick={() => toggleDelete(feedbackItem._id)}
                  className="justify-self-end"
                  size="icon"
                  variant="outline"
                >
                  <DeleteIcon className='w-4 h-4' />
                  <span className="sr-only">Delete</span>
                </Button>) : null}
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className='my-4 font-bold text-center text-3xl'>Feel Free to leave a feedback</h1>
      )}
    </>
  );
};


const ThumbsUpIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const ThumbsUpFilledIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);
