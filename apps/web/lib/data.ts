import { Post, AvatarConfig } from "../components/landing/PostCardLanding";

export const posts: Post[] = [
  {
    id: "p1",
    username: "SilentFox42",
    role: "Junior Developer",
    title: "I wasted 3 months learning Redux before understanding React state",
    tags: ["React", "Mistake"],
    votes: 214,
  },
  {
    id: "p2",
    username: "GhostOwl99",
    role: "Backend Engineer",
    title: "Pushed directly to main on a Friday. Took down prod for 4 hours.",
    tags: ["DevOps", "Lesson"],
    votes: 389,
  },
  {
    id: "p3",
    username: "NeonBadger",
    role: "Fullstack Dev",
    title: "Spent a week optimising code that wasn't even the bottleneck",
    tags: ["Performance", "Debugging"],
    votes: 176,
  },
  {
    id: "p4",
    username: "CrypticMoth",
    role: "Senior Engineer",
    title: "Over-engineered a side project so much I never shipped it",
    tags: ["Architecture", "Shipping"],
    votes: 301,
  },
  {
    id: "p5",
    username: "VoidLynx",
    role: "ML Engineer",
    title: "Trained a model for 2 days with the wrong labels. Noticed at deploy.",
    tags: ["ML", "Mistake"],
    votes: 258,
  },
  {
    id: "p6",
    username: "AshPanda",
    role: "Frontend Dev",
    title: "Agreed to a deadline without estimating. Worked 3 weekends straight.",
    tags: ["Career", "Planning"],
    votes: 432,
  },
];

export const landingAvatarConfigs: AvatarConfig[] = [
  { style: "adventurer-neutral", colors: "065f46,064e3b,047857" },
  { style: "bottts-neutral", colors: "1e3a5f,1e40af,1d4ed8" },
  { style: "fun-emoji", colors: "7c2d12,92400e,b45309" },
  { style: "lorelei-neutral", colors: "4a1d96,5b21b6,6d28d9" },
  { style: "micah", colors: "881337,9f1239,be123c" },
  { style: "adventurer", colors: "134e4a,115e59,0f766e" },
];

export type OrbitEntry = {
  angle: number;
  radius: number;
  travel: number;
};

export const orbitConfig: OrbitEntry[] = [
  { angle: 300, radius: 500, travel: 110 },
  { angle: 60, radius: 500, travel: 110 },
  { angle: 115, radius: 560, travel: 70 },
  { angle: 148, radius: 520, travel: 110 },
  { angle: 212, radius: 520, travel: 110 },
  { angle: 245, radius: 560, travel: 70 },
];

export const FILTERS: string[] = ["All", "React", "DevOps", "Career", "ML", "Performance", "Architecture"];
