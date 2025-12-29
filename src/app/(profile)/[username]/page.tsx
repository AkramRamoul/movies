import { getUserFilmStats } from "@/actions/movies";
import { getCurrentUser } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import ProfileTabs from "@/modules/film/ui/Tabs";
import FavMovies from "@/modules/profile/ui/FavMovies";
import RecentActivity from "@/modules/profile/ui/RecentActivity";
import { eq } from "drizzle-orm";

const Home = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const logged = await getCurrentUser();

  const [profileUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!profileUser) {
    return <div>User not found</div>;
  }

  const isOwner = logged?.username === username;
  const stats = await getUserFilmStats(profileUser.id);

  return (
    <div className="max-w-7xl pb-12 min-h-screen mx-auto px-auto px-6 md:px-30 bg-noise">
      <div className="relative">
        <div className="relative max-w-7xl flex-1 mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border border-white/20">
              <AvatarImage src={profileUser.image || "/Avatar.png"} />
              <AvatarFallback>
                {profileUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-row gap-2">
              <h1 className="text-xl font-semibold text-white tracking-wide">
                {profileUser.username}
              </h1>
              {isOwner && (
                <div className="flex items-center gap-3">
                  <button className="px-4 py-1.5 text-xs font-medium rounded bg-[#445566] text-[#c8d4e0] hover:bg-[#556677] transition hover">
                    EDIT PROFILE
                  </button>

                  <button className="h-8 w-8 flex items-center justify-center rounded-full bg-[#2e3840] text-white/70 hover:text-white">
                    •••
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1 text-center">
            <Stat label="FILMS" value={stats.totalFilms} />
            <Separator orientation="vertical" />
            <Stat label="THIS YEAR" value={stats.filmsThisYear} />
            <Stat label="LISTS" value={stats.watchedCount} />
            <Stat label="FOLLOWING" value={2} />
            <Stat label="FOLLOWERS" value={0} />
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1">
          <ProfileTabs username={username} />
          <FavMovies />
          <RecentActivity username={username} />
        </div>

        {/* Sidebar */}
        <div className="w-72 shrink-0 bg-[#2e3840] p-4 rounded-lg">kdkdd</div>
      </div>
    </div>
  );
};

export default Home;

const Stat = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="flex flex-col w-[70px]">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs font-light text-white/80">{label}</span>
    </div>
  );
};
