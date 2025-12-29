import { Activity } from "@/types/types";
import LikeActivity from "./ActivityType/LikeActivity";
import ReviewActivity from "./ActivityType/ReviewActivity";
import RewatchActivity from "./ActivityType/RewatchActivity";
import WatchActivity from "./ActivityType/WatchActivity";
import WatchListedActivity from "./ActivityType/WatchListed";

type ActivityFeedProps = {
  activities: Activity[];
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        No activity in the last 21 days
      </p>
    );
  }
  console.log(activities);

  return (
    <div className="mt-6 space-y-4">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
}

const activityMap = {
  liked: LikeActivity,
  reviewed: ReviewActivity,
  rewatched: RewatchActivity,
  watched: WatchActivity,
  watchlisted: WatchListedActivity,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActivityItem({ activity }: { activity: any }) {
  const Component =
    activityMap[activity.activityType as keyof typeof activityMap];

  if (!Component) return null;

  return <Component activity={activity} />;
}
