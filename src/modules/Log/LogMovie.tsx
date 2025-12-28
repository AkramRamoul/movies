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
import {
  AddDiaryEntry,
  createMovieReview,
  hasUserReviewedMovie,
  updateMovieReview,
} from "@/actions/movies";
import { toast } from "sonner";
import LikeMovie from "../home/ui/Movies/LikeMovie";
import { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import { FieldGroup } from "@/components/ui/field";

const formSchema = z.object({
  watched: z.boolean().optional(),
  review: z.string().optional(),
  rating: z.number().optional(),
});
interface LogMovieProps {
  movieId: string;
  userId: string;
  poster?: string;
  onSave: () => void;
  title: string;
  initialData?: {
    review?: string;
    rating?: number;
    watched?: boolean;
    watchedDate?: Date;
    reWatched?: boolean;
  };
}

const LogMovie = ({
  movieId,
  userId,
  poster,
  onSave,
  title,
  initialData,
}: LogMovieProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      watched: initialData?.watched ?? true,
      review: initialData?.review ?? "",
      rating: initialData?.rating,
    },
  });

  const isEditMode = !!initialData;

  const [addToDiary, setAddtoDiary] = useState(initialData?.watched ?? true);
  const [watchedDate, setWatchedDate] = useState<Date | undefined>(
    initialData?.watchedDate ?? new Date()
  );
  const [ratingTouched, setRatingTouched] = useState(
    initialData?.rating !== undefined
  );

  const [reWatched, setReWatched] = useState(initialData?.reWatched ?? false);

  useEffect(() => {
    const checkReviewed = async () => {
      const reviewed = await hasUserReviewedMovie(movieId, userId);
      setReWatched(reviewed);
    };

    checkReviewed();
  }, [movieId, userId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const ratingToSend = ratingTouched ? values.rating : undefined;

    if (isEditMode) {
      await updateMovieReview(
        movieId,
        userId,
        ratingToSend!,
        values.review ?? ""
      );

      if (values.watched && addToDiary) {
        await AddDiaryEntry(movieId, userId, watchedDate, reWatched);
      }

      toast.success("Movie updated");
    } else {
      await createMovieReview(
        movieId,
        userId,
        ratingToSend,
        values.review ?? "",
        reWatched
      );

      if (values.watched && addToDiary) {
        await AddDiaryEntry(movieId, userId, watchedDate, reWatched);
      }

      toast.success(`${title} was added to you films`);
    }

    onSave();
  };

  useEffect(() => {
    if (!initialData) return;
    form.reset({
      watched: initialData.watched ?? true,
      review: initialData.review ?? "",
      rating: initialData.rating ?? 0,
    });
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-12 rounded-md"
      >
        {/* LEFT SIDE — POSTER */}
        <div className="bg-gray-900 rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-50 h-[220px] border hover:border-2 hover:border-amber-50 relative">
          <Image
            fill
            alt="image"
            src={poster ? poster : "/logo.png"}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-start w-full gap-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {!addToDiary && (
            <div className="flex flex-row items-center gap-2">
              <Checkbox
                checked={addToDiary}
                onCheckedChange={(checked) => setAddtoDiary(!!checked)}
              />
              <span>Add to Diary</span>
            </div>
          )}
          {addToDiary && (
            <FormField
              control={form.control}
              name="watched"
              render={({}) => (
                <FieldGroup className="flex flex-row">
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        className="w-5 h-5"
                        checked={addToDiary}
                        onCheckedChange={(checked) => {
                          const value = !!checked;
                          setAddtoDiary(value);

                          if (value) {
                            form.setValue("watched", true);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>
                      Watched on{" "}
                      <DatePicker
                        value={watchedDate}
                        onChange={setWatchedDate}
                      />
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <Checkbox
                      className="w-5 h-5"
                      checked={reWatched}
                      onCheckedChange={(checked) => setReWatched(!!checked)}
                    />
                    <FormLabel>I&apos;ve watched this before</FormLabel>
                  </FormItem>
                </FieldGroup>
              )}
            />
          )}

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
                      "border border-gray-700! bg-[#ccdded]! text-black rounded-sm"!
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
              <div className="flex flex-row justify-between items-center">
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarPicker
                      value={field.value}
                      onChange={(val: number) => {
                        setRatingTouched(true);
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                </FormItem>
                <LikeMovie movieId={movieId} userId={userId} size="8" />
              </div>
            )}
          />
          <div className="flex justify-end mt-2 pr-3">
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
