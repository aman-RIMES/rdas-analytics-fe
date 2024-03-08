import { useParams } from "react-router-dom";
const Content = () => {
  const params = useParams();
  return <div>Content {params.contentId}</div>;
};

export default Content;
