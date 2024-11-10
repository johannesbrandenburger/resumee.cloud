import { Alert, AlertDescription, AlertTitle } from "~/app/_components/ui/alert";

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay = ({ message }: ErrorDisplayProps) => (
  <div className="flex h-screen items-center justify-center p-4">
    <Alert variant="destructive" className="max-w-md">
      <AlertTitle>Error Loading Resume</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  </div>
);