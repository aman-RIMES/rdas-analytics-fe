import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  errorMessage?: string;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  return (
    <div className="flex justify-center my-20 ">
      <Alert className="w-3/4 bg-white bg-opacity-70" variant="destructive">
        <AlertCircle className="h-5 w-5 mt-1" />
        <AlertTitle className="text-md">Error !</AlertTitle>
        <AlertDescription className="text-sm">
          {errorMessage ||
            `Failed to generate model. This could be due to missing data for
              the chosen filters. Try changing your filters and start again.`}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorMessage;
