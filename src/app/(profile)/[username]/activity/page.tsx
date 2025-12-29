import { getRecentActivity } from "@/actions/movies";
import { getCurrentUser } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import ActivityFeed from "@/modules/activity/ActivityFeed";
import Links from "@/modules/activity/Nav";
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
  console.log(activities);
  return (
    <div className="max-w-7xl h-screen mx-auto px-auto px-6 md:px-50 bg-noise">
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
