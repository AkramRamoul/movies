import PopularMovies from "@/modules/home/ui/Movies/PopularMovies";

export default async function Home() {
  return (
    <div className="max-w-7xl h-screen mx-auto px-auto px-6 md:px-50 bg-noise">
      <PopularMovies />
    </div>
  );
}
