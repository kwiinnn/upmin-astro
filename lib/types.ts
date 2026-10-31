export type Suggestion = { topic: string; createdAt: number };

export type AdminData = {
  storage: "redis" | "memory";
  suggestions: Suggestion[];
};
