import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type props = {
    message: string;
    className?: string;
}

export const FormError = ({
  message,
  className
} : props) => {
  if (!message) return null;

  return (
    <div className={`bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm ${className && className}`}>
      <ExclamationTriangleIcon className="h-8 w-8" />
      <p className="text-base">{message}</p>
    </div>
  );
};
