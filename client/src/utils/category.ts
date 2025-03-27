import { z } from "zod";

export const categories = [
  "Vlogs",
  "Tech Reviews",
  "Gaming",
  "Education & Tutorials",
  "DIY & Crafts",
  "Fitness & Health",
  "Food & Cooking",
  "Beauty & Fashion",
  "Motivation & Self-Improvement",
  "Music & Covers",
  "Movie & TV Show Reviews",
  "Science & Technology",
  "Finance & Business",
  "Comedy & Skits",
  "Pranks & Challenges",
  "Travel & Adventure",
  "ASMR & Relaxation",
  "Car & Automotive",
  "Unboxing & Hauls",
  "Storytelling & Podcasting",
] as const;

export const CategorySchema = z.enum(categories);
