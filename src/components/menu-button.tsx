/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export const MenuButton = ({ url, icon, title }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  });

  return (
    <Button
      variant="ghost"
      className={
        cn(
          location.pathname === "/predictive-tools/"
            ? "bg-red-400"
            : "bg-blue-200"
        ) + "w-full justify-between hover:bg-yellow-300"
      }
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
