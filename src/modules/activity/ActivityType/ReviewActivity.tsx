import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";

const ReviewActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);

  return <div className="text-sm">Reviewed movie {activity.movieId}</div>;
};

export default ReviewActivity;
