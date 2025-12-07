import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React from "react";

interface props {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const StarPicker = ({
  value = 0,
  onChange,
  disabled,
  className,
}: props) => {
  const [hovered, setHovered] = React.useState(0);

  const handleChange = (value: number) => {
    onChange?.(value);
  };

  const stars = [1, 2, 3, 4, 5];
  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "p-0.5 hover:scale-110 transition",
            disabled && "cursor-not-allowed hover:scale-100"
          )}
          disabled={disabled}
          onClick={() => handleChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hovered || value) >= star
                ? "stroke-[#00e054] fill-[#00e054]"
                : "fill-[#40BCF4] stroke-[#40BCF4]"
            )}
            //
          />
        </button>
      ))}
    </div>
  );
};
