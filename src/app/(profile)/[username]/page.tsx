import { getCurrentUser } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const Home = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const logged = await getCurrentUser();

  const [profileUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const isOwner = logged?.username === username;

  return (
    <div className="max-w-7xl mx-auto bg-noise h-screen">
      <Avatar>
        <AvatarImage src={profileUser.image as string} />
        <AvatarFallback>{profileUser.username}</AvatarFallback>
      </Avatar>

      {isOwner ? <div>Your profile (edit)</div> : <div>Public profile</div>}
    </div>
  );
};

export default Home;
