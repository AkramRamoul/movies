"use client";

import { useState } from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const Elemnet = ({ els }: { els: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {els.map((name) => (
        <span
          key={name}
          className="bg-[#283038] text-[#99a9ba] font-semibold px-3 py-1 rounded-xs text-sm hover:text-[#deeeff]"
        >
          {name}
        </span>
      ))}
    </div>
  );
};

export const MovieTabs = ({ movie }: { movie: any }) => {
  const buildTabbedContent = (movie: any) => [
    {
      title: "CAST",
      content: movie.Actors?.split(", ") || [],
      label: "Actors",
    },
    {
      title: "CREW",
      content: [`Director: ${movie.Director}`, `Writer: ${movie.Writer}`],
      label: null,
    },
    {
      title: "DETAILS",
      content: [
        { label: "Runtime", values: [movie.Runtime] },
        { label: "Language", values: movie.Language?.split(", ") || [] },
        { label: "Country", values: movie.Country?.split(", ") || [] },
        { label: "Awards", values: [movie.Awards] },
      ],
      isStructured: true,
    },
    {
      title: "GENRES",
      content: movie.Genre?.split(", ") || [],
      label: "Genres",
    },
    {
      title: "Ratings",
      content: [
        { label: "Metascore", values: [movie.Metascore] },
        { label: "IMDB Rating", values: [movie.imdbRating] },
      ],
      isStructured: true,
    },
  ];

  const tabs = buildTabbedContent(movie);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col w-full text-gray-300">
      {/* Tabs row */}
      <div className="flex gap-6 border-b border-gray-600">
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            onClick={() => setActiveIndex(index)}
            className={`border-b-2 border-transparent transition-colors ${
              activeIndex === index
                ? "border-white text-white"
                : "text-[#00e056] hover:border-b-[#00e056]"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 flex flex-col gap-3">
        {tabs[activeIndex].isStructured ? (
          tabs[activeIndex].content.map((item: any, i: number) => (
            <div key={i}>
              <span className="font-semibold">{item.label}:</span>
              <Elemnet els={item.values} />
            </div>
          ))
        ) : (
          <Elemnet els={tabs[activeIndex].content} />
        )}
      </div>
    </div>
  );
};
