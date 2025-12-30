import { getRecentActivity } from "@/actions/movies";
import { getCurrentUser } from "@/actions/user";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import ActivityFeed from "@/modules/activity/ActivityFeed";
import ActivityNav from "@/modules/activity/ActivityNav";
import { Separator } from "@radix-ui/react-separator";
import { eq } from "drizzle-orm";

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const [profileUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const user = await getCurrentUser();

  const activities = await getRecentActivity(user!.id);
  return (
    <div className="max-w-7xl min-h-screen mx-auto px-auto px-6 md:px-50 bg-noise">
      <ActivityNav profileUser={profileUser} username={username} />
      <main className="mt-6">
        <h1 className="text-base mt-6 text-[#99a9ba] uppercase tracking-widest">
          Your Activity
        </h1>
        <Separator />
      </main>
      <ActivityFeed activities={activities} />
    </div>
  );
};

export default page;
