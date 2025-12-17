"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    if (slug === "") return pathname === `/${username}`;
    return pathname === `/user/${username}/${slug}`;
  };

  const profileTabs = [
    { label: "Profile", slug: "" },
    { label: "Activity", slug: "activity" },
    { label: "Films", slug: "films" },
    { label: "Diary", slug: "diary" },
    { label: "Reviews", slug: "reviews" },
    { label: "Watchlist", slug: "watchlist" },
    { label: "Lists", slug: "lists" },
    { label: "Likes", slug: "likes" },
    { label: "Tags", slug: "tags" },
    { label: "Network", slug: "network" },
  ];

  return (
    <nav className="flex items-center gap-4 justify-center py-2 border border-white/10">
      {profileTabs.map((tab) => {
        const href = tab.slug === "" ? `/${username}` : `/${tab.slug}`;

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
                  : "text-[#9ab] hover:text-white"
              }`}
            >
              {tab.label}
            </span>

            {isActive(tab.slug) && (
              <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#00e054]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
