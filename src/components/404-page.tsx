import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <div className="h-400 w-500 flex flex-col justify-center items-center bg-red-500 gap-3">
      <h2>404 -- Not Found</h2>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFoundPage;
