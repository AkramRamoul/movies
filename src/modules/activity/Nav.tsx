"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Links = ({ username }: { username: string }) => {
  const profileTabs = [
    { label: "Activity", slug: "activity" },
    { label: "Films", slug: "films" },
    { label: "Diary", slug: "diary" },
    { label: "Reviews", slug: "reviews" },
    { label: "Watchlist", slug: "watchlist" },
    { label: "Lists", slug: "lists" },
    { label: "Likes", slug: "likes" },
    { label: "Tags", slug: "tags" },
  ];

  const pathname = usePathname();

  const isActive = (slug: string) => {
    if (slug === "") return pathname === `/${username}`;
    return pathname === `/${username}/${slug}`;
  };

  return (
    <div className="flex items-center gap-4 justify-center">
      {profileTabs.map((tab) => {
        const href = `/${username}/${tab.slug}`;

        return (
          <Link
            key={tab.label}
            href={href}
            className="relative pb-2 flex items-center text-sm tracking-wide"
          >
            <span
              className={`px-1 transition-colors ${
                isActive(tab.slug)
                  ? "text-white"
                  : "text-[#9ab] hover:text-[#40bbf5]"
              }`}
            >
              {tab.label}
            </span>

            {isActive(tab.slug) && (
              <span className="absolute left-0 right-0 -bottom-3 h-px bg-[#00e054]" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default Links;
