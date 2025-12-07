import { ReviewsTable } from "@/db/schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

const imdbMovieIds = [
  "tt26443597",
  "tt1262426",
  "tt12300742",
  "tt1312221",
  "tt14364480",
  "tt24950660",
  "tt0816692", // Interstellar
  "tt4154756", // Avengers: Infinity War
];

function randomRating() {
  return Math.floor(Math.random() * 5) + 1; // 1–5
}

function randomReviewText() {
  const texts = [
    "Amazing movie!",
    "Pretty good, I enjoyed it.",
    "Not bad, could be better.",
    "Didn’t like it that much.",
    "A masterpiece.",
    "Overrated but fun.",
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!);
  console.log("🌱 Seeding database...");

  for (const movieId of imdbMovieIds) {
    const reviewCount = Math.floor(Math.random() * 20) + 10; // 10–30 reviews

    const entries = Array.from({ length: reviewCount }, (_, i) => ({
      movieId,
      userId: `seed_user_${i}`, // unique for this run
      rating: randomRating(),
      reviewText: randomReviewText(),
      isSeeded: true,
    }));

    await db.insert(ReviewsTable).values(entries);

    console.log(`Inserted ${reviewCount} reviews for ${movieId}`);
  }

  console.log("🌱 Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
