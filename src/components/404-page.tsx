import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl">404 -- Not Found</h1>
      <Button className="mt-4" onClick={() => navigate("/")}>
        Take me Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
