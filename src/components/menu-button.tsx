/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const MenuButton = ({ url, icon, title }: any) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="w-full justify-between hover:bg-yellow-300"
      onClick={() => navigate(url)}
    >
      <div className="flex items-center">
        {icon}
        {title}
      </div>
    </Button>
  );
};

export default MenuButton;
