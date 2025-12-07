import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

const SearchBox = () => {
  return (
    <div className="relative">
      <Input className="w-30 rounded-4xl h-8" />
      <SearchIcon className="absolute w-4 h-4 right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};

export default SearchBox;
