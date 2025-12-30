import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import Links from "./Nav";
import { User } from "next-auth";

const ActivityNav = ({
  profileUser,
  username,
}: {
  profileUser: User;
  username: string;
}) => {
  return (
    <nav className="flex justify-between items-center mt-8 bg-[#2c3440] py-3 pl-2 pr-6 rounded-sm ">
      <div className="flex gap-2">
        <Avatar className="h-6 w-6 border border-white/20">
          <AvatarImage src={profileUser.image || "/Avatar.png"} />
          <AvatarFallback>
            {profileUser.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-[15px] font-bold hover:text-[#40bbf5] cursor-pointer">
          {username}
        </h1>
      </div>
      <Links username={username} />
    </nav>
  );
};

export default ActivityNav;
