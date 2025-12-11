"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StarPicker } from "@/components/star-rating";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createMovieReview } from "@/actions/movies";
import { toast } from "sonner";

const formSchema = z.object({
  watched: z.boolean().optional(),
  review: z.string().optional(),
  rating: z.number().optional(),
});
interface LogMovieProps {
  movieId: string;
  userId: string;
  onSave: () => void;
}

const LogMovie = ({ movieId, userId, onSave }: LogMovieProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      watched: true,
      review: "",
      rating: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createMovieReview(
      movieId,
      userId,
      values.rating ?? 0,
      values.review ?? ""
    );
    if (result) {
      onSave();
      toast.success("Movie added to your films");
    } else {
      console.log("Failed to create review");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-12 rounded-md"
      >
        {/* LEFT SIDE — POSTER */}
        <div className="bg-gray-900 rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-50 h-[220px] border hover:border-2 hover:border-amber-50 relative">
          <Image fill alt="image" src="/logo.jpeg" className="object-cover" />
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="flex flex-col justify-start w-full gap-6">
          <h2 className="text-2xl font-semibold">Animusic 2</h2>

          {/* Watched Checkbox */}
          <FormField
            control={form.control}
            name="watched"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Watched on 07 Dec 2025</FormLabel>
              </FormItem>
            )}
          />

          {/* Review Textarea */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add a review</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className={cn(
                      "bg-[#ccdded] border-gray-700 text-black placeholder-[#899aab]",
                      "h-32 resize-none p-3 focus:bg-white!",
                      "border border-gray-700! bg-[#ccdded]! text-black"! // <-- KEY FIX
                    )}
                    placeholder="Add a review..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <StarPicker
                    value={field.value}
                    onChange={(val: number) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#00b020] hover:bg-[#00a01c] text-white h-8 px-5 py-1 font-bold rounded-sm"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LogMovie;
