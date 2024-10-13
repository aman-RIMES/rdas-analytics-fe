/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export const MenuButton = ({ url, icon, title }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button
      variant="ghost"
      className={cn(
        location.pathname === url
          ? "bg-yellow-300 text-gray-800 hover:bg-yellow-300"
          : "hover:bg-lime-100",
        "w-full justify-between "
      )}
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
