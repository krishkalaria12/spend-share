import { FC, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type CreateFeedbackProps = {
  value: string;
  isLoading: boolean;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const CreateFeedback: FC<CreateFeedbackProps> = ({
  value,
  isLoading,
  onChange,
  handleSubmit,
  isSubmitting
}) => {

  if (isLoading) {
    return (
      <div className="max-w-3xl w-full mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How can we improve our platform?
          </h1>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            We&#39;d love to hear your feedback. What&#39;s missing? What could be better?
            Let us know!
          </p>
        </div>
        <div className={`max-w-3xl w-full ${!isLoading ? 'grid-cols-4 items-start gap-4' : 'w-full gap-10 flex jusitfy-between items-center'} mt-8`}> 
          <Skeleton className='rounded-sm h-8 w-[400px] grid-cols-3' />
          <Skeleton className='rounded-md h-8 w-12 grid-cols-1' />
        </div>
    </div>
    )
  }

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          How can we improve our platform?
        </h1>
        <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          We&#39;d love to hear your feedback. What&#39;s missing? What could be better?
          Let us know!
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid max-w-3xl grid-cols-4 items-start gap-4 mt-8">
          <Input
            className="col-span-3"
            value={value}
            onChange={onChange}
            placeholder="Enter your feedback"
            type="text"
            name="feedback"
          />
          <Button className="w-full col-span-1 md:w-auto" size="lg" type="submit" disabled={isLoading}>
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Loading</span>
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
