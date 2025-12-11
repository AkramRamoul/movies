"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star } from "lucide-react";

interface MovieReviewsResult {
  counts: Record<number, number>;
  total: number;
}

export function RatingsChart({ counts, total }: MovieReviewsResult) {
  const max = Math.max(...Object.values(counts));

  const average =
    Object.entries(counts).reduce(
      (sum, [rating, count]) => sum + Number(rating) * count,
      0
    ) / Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(max);
  console.log(average);
  console.log(counts);
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardContent className="flex items-end gap-3 py-3">
        {/* Left star */}
        <Star className="text-green-500 h-3 w-3 fill-green-500" />

        {/* Bars */}
        <div className="flex items-end gap-1 h-16">
          {Object.keys(counts)
            .sort((a, b) => Number(a) - Number(b))
            .map((key) => {
              const count = counts[Number(key)];
              const height = max ? (count / max) * 100 : 0;
              const percentage = total
                ? Math.round((counts[Number(key)] / total) * 100)
                : 0;

              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-6 bg-[#445566] rounded-none"
                      style={{ height: `${height}%` }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#445566] text-white">
                    <p>{count + ` Ratings (${percentage}%) `}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
        </div>

        <div className="flex flex-col items-center gap-3 ">
          <span className="text-[#778899] font-light text-lg">
            {average.toFixed(1)}
          </span>
          <div className="flex items-center ml-2 gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 text-green-500 fill-green-500" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
