import { Activity } from "@/types/types";

export function getActivityVariant(activity: Activity) {
  if (activity.rating !== null) return "REVIEWED";

  if (activity.rewatch) return "REWATCHED";

  return "WATCHED";
}
