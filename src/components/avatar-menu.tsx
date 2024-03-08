import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvatarMenu = () => {
  return (
    <div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarMenu;
